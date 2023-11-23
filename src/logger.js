const generateLogger = (getNow = ()=>new Date()) => {
  const logs = [];
  return {
    info: (input, status, errors, productId) => {
      const now = getNow();
      logs.push({ timestamp:now, input, status, errors, productId });
    },
    get: () => {
      return logs;
    }
  }
}

module.exports = generateLogger;