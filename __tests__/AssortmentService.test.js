
const validProduct = {
  code: "00000-000000-00000-00000-00000",
  name: "Pietruszka",
  price: 2.5,
  description: "zielony"
}
const backendApi = {
  addProduct: jest.fn(),

}

const createAssortmentService = (api) => {
  const addProduct = (dto) => {
    if (!dto.code || !dto.name || !dto.price)
      throw new Error();
    if(!dto.code.match(/^[\d-]{30}$/))
      throw new Error();
    if(!dto.name.match(/^.{5,50}$/))
      throw new Error();
    //other mocked operations
    api.addProduct(dto);
  }
  return { addProduct };
}

describe("AssortmentService", () => {
  describe('Basic adding', () => {
    it("Should add product", () => {
      const givenDTO = validProduct;
      const assortmentService = createAssortmentService(backendApi);
      assortmentService.addProduct(givenDTO);

      expect(backendApi.addProduct).toHaveBeenCalledWith(givenDTO);
    });
    it('product should have code', () => {
      const givenDTO = { ...validProduct, code: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it('product should have name', () => {
      const givenDTO = { ...validProduct, name: undefined };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    });
    it('product should have price', () => {
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
  })
  describe('code validation', () => {
    it('Should have no more than 30 characters', () => {
      const givenDTO = { ...validProduct, code: Array(31).fill('1').join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    })
    it('Should have no less than 30 characters', () => {
      const givenDTO = { ...validProduct, code: Array(29).fill('1').join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    })
    it('Should not allow invalid characters', () => {
      const givenDTO = { ...validProduct, code: Array(30).fill('a').join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    })
  })
  describe('name validation', ()=> {
    it('Should have no more than 50 characters', () => {
      const givenDTO = { ...validProduct, name: Array(51).fill('1').join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    })
    it('Should have no less than 5 characters', () => {
      const givenDTO = { ...validProduct, name: Array(4).fill('1').join("") };
      const assortmentService = createAssortmentService(backendApi);
      const addProcess = () => assortmentService.addProduct(givenDTO);

      expect(addProcess).toThrow(Error);
    })
  })
  describe('price validation', ()=> {
    
  })

});
