const createCategoryService = (inputValidCategories) => {
  const validCategories = new Set(inputValidCategories);

  return {
    filter: (input) => {
      return input.filter((category) => validCategories.has(category));
    }
  }
}

module.exports = createCategoryService;