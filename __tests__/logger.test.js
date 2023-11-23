const generateLogger = require('../src/logger');

describe('Logger', () => {
    it('should log input values', () => {
      const parameters = [];
      const logger = generateLogger();
  
      logger.info(parameters);
      expect(logger.get()).toEqual([{ input: parameters }]);
    });
    it('log should include status', () => {
      const status = 'success';
      const logger = generateLogger();
  
      logger.info(undefined, status);
      expect(logger.get()).toEqual([{ status }]);
    });
    it('log should include errors', () => {
      const errors = ['SOME_ERROR'];
      const logger = generateLogger();
  
      logger.info(undefined, undefined, errors);
      expect(logger.get()).toEqual([{ errors }]);
    });
    it('log should include productId', () => {
      const productId = "PRODUCT_ID";
      const logger = generateLogger();
  
      logger.info(undefined, undefined, undefined,"PRODUCT_ID");
      expect(logger.get()).toEqual([{ productId }]);
    });
  
  });
  
  
  