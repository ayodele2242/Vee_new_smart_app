export const generateSelectedArray = (
    selectedItems: string[],
    selectedSubcategoryItems: string[]
  ): { category: string[] } => {
    const selectedCategories = selectedItems.map((category) => category.toLowerCase());
    const selectedSubcategories = selectedSubcategoryItems.map((subcategory) => subcategory.toLowerCase());
  
    return { category: [...selectedCategories, ...selectedSubcategories] };
  };