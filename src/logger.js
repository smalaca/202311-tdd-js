const { v4: uuid } = require('uuid');

const generateLogger = (getNow = () => new Date(), getId = uuid) => {
  const logs = [];
  return {
    info: (input, status, errors, productId) => {
      const now = getNow();
      const id = getId();
      logs.push({ id, timestamp: now, input, status, errors, productId });
    },
    get: () => {
      return logs;
    }
  }
}

module.exports = generateLogger;