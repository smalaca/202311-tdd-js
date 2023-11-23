const createCategoryService = require('./CategoryService');

const VALID_CATEGORY = 'valid';
const VALID_CATEGORIES = [VALID_CATEGORY];

describe('CategoryService', () => {
  it('should do nothing if array is empty', () => {
    const inputCategories = [];
    const categoryService = createCategoryService(VALID_CATEGORIES);

    expect(categoryService.filter(inputCategories)).toEqual([]);
  });
  it('should not filter out valid category', () => {
    const inputCategories = [VALID_CATEGORY];
    const categoryService = createCategoryService(VALID_CATEGORIES);

    expect(categoryService.filter(inputCategories)).toEqual([VALID_CATEGORY]);
  });
  it('should filter out invalid category', () => {
    const inputCategories = ['notvalid'];
    const categoryService = createCategoryService(VALID_CATEGORIES);

    expect(categoryService.filter(inputCategories)).toEqual([]);
  });
})