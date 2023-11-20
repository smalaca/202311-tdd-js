class FieldError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}
const PRODUCT_AMOUNT = 10;
const PRODUCT_ID = "ID"
const validProduct = {
  code: "00000-000000-00000-00000-00000",
  name: "Pietruszka",
  price: 2.5,
  description: "zielony",
  assortmentId: "warzywa"
};
const validPayload = {
  ...validProduct,
  amount: PRODUCT_AMOUNT
}
const validEvent = {
  ...validPayload,
  id: PRODUCT_ID
}
const backendApi = {
  addProduct: jest.fn((product) => {
    if(product.assortmentId !== validProduct.assortmentId) throw new FieldError('assortmentId', 'Invalid assortment')
    return { id: PRODUCT_ID }
  }),
};
const eventEmitter = {
  emit: jest.fn(),
};

const createAssortmentService = (api, eventBus) => {
  const reportError = (field, message) => {
    throw new FieldError(field, message);
  };
  const addProduct = (dto, amount) => {
    try {
      if (!dto.code) reportError("code", "Missing value");
      if (!dto.name) reportError("name", "Missing value");
      if (!dto.price) reportError("price", "Missing value");
      if (!dto.code.match(/^[\d-]{30}$/))
        reportError(
          "code",
          "value should be 30 characters long and contain only digits and dashes",
        );
      if (!dto.name.match(/^.{5,50}$/))
        reportError("name", "value length should be between 5 and 50");
      if (!dto.assortmentId) reportError("assortmentId", "Missing value");
      if (!amount) reportError("amount", "Missing value");
      //other mocked operations
      const { id } = api.addProduct({
        ...dto,
        amount
      });
      if (eventBus) {
        eventBus.emit("productAdded", {id, ...dto, amount});
      }
    } catch (e) {
      if (eventBus) {
        eventBus.emit("productAddingFailed", { [e.field]: e.message });
      } else {
        throw e;
      }
    }
  };
  return { addProduct };
};

describe("AssortmentService", () => {
  afterEach(() => {
    eventEmitter.emit.mockClear();
  });

  describe("Basic adding", () => {
    it("Should add product", () => {
      const givenDTO = validProduct;
      const assortmentService = createAssortmentService(backendApi);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(backendApi.addProduct).toHaveBeenCalledWith(validPayload);
    });
    it("product should have code", () => {
      const givenDTO = { ...validProduct, code: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
    it("product should have name", () => {
      const givenDTO = { ...validProduct, name: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
    it("product should have price", () => {
      const givenDTO = { ...validProduct, price: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
    it("product should have assortmentId", () => {
      const givenDTO = { ...validProduct, assortmentId: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
    it("should allow optional description", () => {
      const givenDTO = { ...validProduct, description: undefined };
      const assortmentService = createAssortmentService(backendApi);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(backendApi.addProduct).toHaveBeenCalledWith(validPayload);
    });
  });
  describe("code validation", () => {
    it("Should have no more than 30 characters", () => {
      const givenDTO = { ...validProduct, code: Array(31).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
    it("Should have no less than 30 characters", () => {
      const givenDTO = { ...validProduct, code: Array(29).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
    it("Should not allow invalid characters", () => {
      const givenDTO = { ...validProduct, code: Array(30).fill("a").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
  });
  describe("name validation", () => {
    it("Should have no more than 50 characters", () => {
      const givenDTO = { ...validProduct, name: Array(51).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
    it("Should have no less than 5 characters", () => {
      const givenDTO = { ...validProduct, name: Array(4).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(addProcess).toThrow(Error);
    });
  });
  describe("Events", () => {
    it("Should emit event on success", () => {
      const givenDTO = validProduct;
      const assortmentService = createAssortmentService(
        backendApi,
        eventEmitter,
      );
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAdded", validEvent);
    });
    it("should publish errors on event bus", () => {
      const givenDTO = { ...validProduct, code: undefined };
      const assortmentService = createAssortmentService(
        backendApi,
        eventEmitter,
      );
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);
      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        code: "Missing value",
      });
    });
  });
  describe("Ids", () => {
    it("should generate id", () => {
      const givenDTO = validProduct;
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAdded", validEvent);
    });
  });
  describe("assortmentId", () => {
    it("should throw if invalid id", () => {
      const givenDTO = {...validProduct, assortmentId: "placki"};
      const backendApi = {
        addProduct: (product) => {
          if(product.assortmentId !== validProduct.assortmentId) throw new FieldError('assortmentId', 'Invalid assortment')
          return { id: "id" }
        },
      };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        assortmentId: "Invalid assortment",
      });
    });
  });
});
