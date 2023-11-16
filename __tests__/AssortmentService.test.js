class FieldError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}

const validProduct = {
  code: "00000-000000-00000-00000-00000",
  name: "Pietruszka",
  price: 2.5,
  description: "zielony",
};
const backendApi = {
  addProduct: jest.fn(),
};
const eventEmitter = {
  emit: jest.fn(),
};

const createAssortmentService = (api, eventBus) => {
  const reportError = (field, message) => {
    throw new FieldError(field, message);
  };
  const addProduct = (dto) => {
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
      //other mocked operations
      const id = api.addProduct(dto);
      if (eventBus) {
        eventBus.emit("productAdded", {id, ...dto});
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
      assortmentService.addProduct(givenDTO);

      expect(backendApi.addProduct).toHaveBeenCalledWith(givenDTO);
    });
    it("product should have code", () => {
      const givenDTO = { ...validProduct, code: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it("product should have name", () => {
      const givenDTO = { ...validProduct, name: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it("product should have price", () => {
      const givenDTO = { ...validProduct, price: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it("should allow optional description", () => {
      const givenDTO = { ...validProduct, description: undefined };
      const assortmentService = createAssortmentService(backendApi);
      assortmentService.addProduct(givenDTO);

      expect(backendApi.addProduct).toHaveBeenCalledWith(givenDTO);
    });
  });
  describe("code validation", () => {
    it("Should have no more than 30 characters", () => {
      const givenDTO = { ...validProduct, code: Array(31).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it("Should have no less than 30 characters", () => {
      const givenDTO = { ...validProduct, code: Array(29).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it("Should not allow invalid characters", () => {
      const givenDTO = { ...validProduct, code: Array(30).fill("a").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
  });
  describe("name validation", () => {
    it("Should have no more than 50 characters", () => {
      const givenDTO = { ...validProduct, name: Array(51).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it("Should have no less than 5 characters", () => {
      const givenDTO = { ...validProduct, name: Array(4).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

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
      assortmentService.addProduct(givenDTO);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAdded", givenDTO);
    });
    it("should publish errors on event bus", () => {
      const givenDTO = { ...validProduct, code: undefined };
      const assortmentService = createAssortmentService(
        backendApi,
        eventEmitter,
      );
      assortmentService.addProduct(givenDTO);
      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        code: "Missing value",
      });
    });
  });
  describe("Ids", () => {
    it("should generate id", () => {
      const givenDTO = validProduct;
      const backendApi = {
        addProduct: () => "id",
      };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAdded", {
        ...givenDTO,
        id: 'id',
      });
    });
  });
});
