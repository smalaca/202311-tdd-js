const generateLogger = require('../src/logger');

const getNow = () => "2023-11-23T12:12:59.960Z";

describe('Logger', () => {
  it('should log input values', () => {
    const parameters = [];
    const logger = generateLogger(getNow);

    logger.info(parameters);
    const [{ input }] = logger.get();
    expect(input).toEqual(parameters);
  });
  it('log should include status', () => {
    const givenStatus = 'success';
    const logger = generateLogger(getNow);

    logger.info(undefined, givenStatus);
    const [{ status }] = logger.get();
    expect(status).toEqual(givenStatus);
  });
  it('log should include errors', () => {
    const givenErrors = ['SOME_ERROR'];
    const logger = generateLogger(getNow);

    logger.info(undefined, undefined, givenErrors);
    const [{ errors }] = logger.get();
    expect(errors).toEqual(givenErrors);
  });
  it('log should include productId', () => {
    const givenProductId = "PRODUCT_ID";
    const logger = generateLogger(getNow);

    logger.info(undefined, undefined, undefined, "PRODUCT_ID");
    const [{ productId }] = logger.get();
    expect(productId).toEqual(givenProductId);
  });
  it('log should include date', () => {

    const logger = generateLogger(getNow);

    logger.info(undefined, undefined, undefined, "PRODUCT_ID");
    const [{ timestamp }] = logger.get();
    expect(timestamp).toEqual(getNow());
  });

});


