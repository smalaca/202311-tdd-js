class CategoryRepository {
    static VALID_CATEGORY_LIST = ['Category 1', 'Category 2', 'Category 3'];

    getValidCategories = (categoryList) => {
        if (!categoryList) return categoryList;
        return categoryList.filter(category => CategoryRepository.VALID_CATEGORY_LIST.includes(category));
    }
}

module.exports = CategoryRepository;