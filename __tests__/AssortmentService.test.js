const createCategoryService = require('../src/CategoryService');
const createLogger = require('../src/logger');

class FieldError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}
const PRODUCT_AMOUNT = 10;
const PRODUCT_ID = "ID"

const validCategories = ['warzywa'];

const validProduct = {
  code: "00000-000000-00000-00000-00000",
  name: "Pietruszka",
  price: 2.5,
  description: "zielony",
  assortmentId: "warzywa",
  categories: validCategories,
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
  addProduct: jest.fn(() => {
    return { id: PRODUCT_ID }
  }),
};
const eventEmitter = {
  emit: jest.fn(),
};

const categoryService = createCategoryService(validCategories);
const logger = createLogger();

const createAssortmentService = (api, eventBus) => {

  const validateProduct = (dto, amount) => {
    const errors = [];
    const reportError = (field, message) => {
      errors.push([field, message]);
    };

    if (!dto.code) reportError("code", "Missing value");
    if (!dto.name) reportError("name", "Missing value");
    if (!dto.price) reportError("price", "Missing value");
    if (!dto.code?.match(/^[\d-]{30}$/))
      reportError(
        "code",
        "value should be 30 characters long and contain only digits and dashes",
      );
    if (!dto.name?.match(/^.{5,50}$/))
      reportError("name", "value length should be between 5 and 50");
    if (!dto.assortmentId) reportError("assortmentId", "Missing value");

    if (!dto.categories) reportError("categories", "Missing value");
    if (!Array.isArray(dto.categories)){
      reportError("categories", "Should be an array");
    } else if (!dto.categories?.length) {
      reportError("categories", "List should not be empty");
    } else {
      dto.categories = categoryService.filter(dto.categories);
      if (!dto.categories.length) reportError("categories", "Should contain valid category");
    }

    if (!amount) reportError("amount", "Missing value");
    return errors.reverse();
  }

  const addProduct = (dto, amount) => {
    const errors = validateProduct(dto, amount);

    if (errors.length) {
      eventBus.emit("productAddingFailed", Object.fromEntries(errors));
      return;
    }
    try {
      const { id } = api.addProduct({
        ...dto,
        amount
      });

      eventBus.emit("productAdded", { id, ...dto, amount });
    } catch (e) {
      eventBus.emit("productAddingFailed", { [e.field]: e.message });
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
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(backendApi.addProduct).toHaveBeenCalledWith(validPayload);
    });
    it("product should have code", () => {
      const givenDTO = { ...validProduct, code: undefined };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        code: "Missing value",
      });
    });
    it("product should have name", () => {
      const givenDTO = { ...validProduct, name: undefined };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        name: "Missing value",
      });
    });
    it("product should have price", () => {
      const givenDTO = { ...validProduct, price: undefined };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        price: "Missing value",
      });
    });
    it("product should have assortmentId", () => {
      const givenDTO = { ...validProduct, assortmentId: undefined };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        assortmentId: "Missing value",
      });
    });
    it("product should have categories", () => {
      const givenDTO = { ...validProduct, categories: undefined };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        categories: "Missing value",
      });
    });
    it("should allow optional description", () => {
      const givenDTO = { ...validProduct, description: undefined };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(backendApi.addProduct).toHaveBeenCalledWith(validPayload);
    });
  });
  describe("code validation", () => {
    it("Should have no more than 30 characters", () => {
      const givenDTO = { ...validProduct, code: Array(31).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        code: "value should be 30 characters long and contain only digits and dashes",
      });
    });
    it("Should have no less than 30 characters", () => {
      const givenDTO = { ...validProduct, code: Array(29).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        code: "value should be 30 characters long and contain only digits and dashes",
      });
    });
    it("Should not allow invalid characters", () => {
      const givenDTO = { ...validProduct, code: Array(30).fill("a").join("") };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        code: "value should be 30 characters long and contain only digits and dashes",
      });
    });
  });
  describe("name validation", () => {
    it("Should have no more than 50 characters", () => {
      const givenDTO = { ...validProduct, name: Array(51).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        name: "value length should be between 5 and 50",
      });
    });
    it("Should have no less than 5 characters", () => {
      const givenDTO = { ...validProduct, name: Array(4).fill("1").join("") };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        name: "value length should be between 5 and 50",
      });
    });
  });
  describe("categories validation", () => {
    it("list should not be empty", () => {
      const givenDTO = { ...validProduct, categories: [] };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        categories: "List should not be empty",
      });
    });
    it("should be an array", () => {
      const givenDTO = { ...validProduct, categories: 'nie' };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        categories: "Should be an array",
      });
    });
    it("should contain at least one valid category", () => {
      const givenDTO = { ...validProduct, categories: ['nie'] };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        categories: "Should contain valid category",
      });
    });
    it("should filter out invalid categories and proceed", () => {
      const givenDTO = { ...validProduct, categories: [...validCategories, 'nie'] };
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(backendApi.addProduct).toHaveBeenCalledWith(validPayload);
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
      const givenDTO = { ...validProduct, assortmentId: "placki" };
      const backendApi = {
        addProduct: (product) => {
          if (product.assortmentId !== validProduct.assortmentId) throw new FieldError('assortmentId', 'Invalid assortment')
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
  describe("multi-error handling", () => {
    it('should return two errors when code and name are undefined', () => {
      const givenDTO = { ...validProduct, code: undefined, name: undefined };
      
      const assortmentService = createAssortmentService(backendApi, eventEmitter);
      assortmentService.addProduct(givenDTO, PRODUCT_AMOUNT);

      expect(eventEmitter.emit).toHaveBeenCalledWith("productAddingFailed", {
        code: 'Missing value',
        name: 'Missing value'
      });
    })
  })
});
