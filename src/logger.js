const generateLogger = () => {
  const logs = [];
  return {
    info: (input, status, errors, productId) => {
      logs.push({ input, status, errors, productId });
    },
    get: () => {
      return logs;
    }
  }
}

module.exports = generateLogger;