import React, { useState, useEffect } from 'react';
import { fetchCategories } from '@/services/category.service';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useRouter } from 'next/navigation';
import SkeletonList from '@/loaders/SkeletonList';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';


const INITIAL_DISPLAY_COUNT = 12;
interface MenusProps {
    headercategory: string | undefined;
    headersubCategory: string | undefined;
    onSelectedCategoriesChange: (selectedCategories: { category: string[] }) => void;
  }




  const Menus: React.FC<MenusProps> = ({ headercategory, headersubCategory, onSelectedCategoriesChange }) => {

  const { push } = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedSubcategoryItems, setSelectedSubcategoryItems] = useState<string[]>([]);
  const [childSearchQuery, setChildSearchQuery] = useState("");
  

  const handleCheckboxChange = (itemName: string, isSubcategory: boolean = false) => {
    const selectedItemsState = isSubcategory ? selectedSubcategoryItems : selectedItems;
    const updatedSelectedItems = selectedItemsState.includes(itemName)
      ? selectedItemsState.filter((item) => item !== itemName)
      : [...selectedItemsState, itemName];

    if (!isSubcategory) {
      // If it's a parent category
      setSelectedItems(updatedSelectedItems);
       // Uncheck the parent checkbox
       setSelectedCategory(null);

      if (!updatedSelectedItems.includes(itemName)) {
        // If unchecked, remove the corresponding subcategories from the list
        const updatedSelectedSubcategories = selectedSubcategoryItems.filter(
          subCategory => !subCategory.startsWith(itemName)
        );
        setSelectedSubcategoryItems(updatedSelectedSubcategories);
          // Notify the parent component about the selected categories whenever they change
      }

      

    } else {
      // If it's a subcategory
      setSelectedSubcategoryItems(updatedSelectedItems);
    }
    //onSelectedCategoriesChange(generateSelectedArray());
  };


  const generateSelectedArray = (): { category: string[] } => {
    const selectedCategories = selectedItems.map((category) => category.toLowerCase());
    const selectedSubcategories = selectedSubcategoryItems.map((subcategory) => subcategory.toLowerCase());

    return { category: [...selectedCategories, ...selectedSubcategories] };
  };


  useEffect(() => {
    // Notify the parent component about the selected categories whenever they change
    onSelectedCategoriesChange(generateSelectedArray());
  },  [selectedItems, selectedSubcategoryItems]);



  useEffect(() => {
    
    setLoading(true);
    fetchCategories(JSON.stringify({ categories: 'categories_tree_listing' }))
      .then((data) => {
        setCategories(data);
        setFilteredCategories(data);
        //console.log("passed ", headercategory);
        if (headercategory && headersubCategory) {
            handleCheckboxChange(headercategory, true); // Check parent category
            handleCheckboxChange(headersubCategory, true); // Check subcategory
          }
      })
      .catch((error) => {
        setError('Error fetching categories. Please check your internet connection. '+ error);
        console.error('Error fetching categories:', error);
      })
      .finally(() => setLoading(false));
  }, [headercategory, headersubCategory]);

  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    return <div>No internet connection. Please check your network settings.</div>;
  }

  if (loading) {
    return <div className="w-[200px] "><SkeletonList numberOfItems={5} /></div>;
  }

  if (error) {
    return <div className='text-danger'>Error: {error}</div>;
  }

  if (categories.length === 0) {
    return <div className='text-danger'>No data available.</div>;
  }


   const countSubcategories = (category: any) => {
    return category.sub_categories.length;
  };

  const hiddenCategoriesCount = categories.length - displayCount;
  const hiddenFilteredCategoriesCount = filteredCategories.length - displayCount;

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory((prevSelectedCategory: number) =>
      prevSelectedCategory === categoryId ? null : categoryId
    );
  };

  const handleSeeMoreClick = () => {
    setDisplayCount(categories.length);
    setShowAll(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    const filtered = categories.filter((category) => {
      // Check if the root_menu (parent category) or any subcategory name matches the search query
      return (
        category.root_menu.toLowerCase().includes(searchQuery)
      );
    });
    setFilteredCategories(filtered);
  };


  const handleDeleteSelectedCategory = (categoryName: string) => {
    // Remove the selected category from the array
    const updatedSelectedItems = selectedItems.filter(item => item !== categoryName);
    setSelectedItems(updatedSelectedItems);

    // Uncheck the parent checkbox
    setSelectedCategory(null);

    // Remove subcategories of the deleted category from the selectedSubcategoryItems list
    const updatedSelectedSubcategories = selectedSubcategoryItems.filter(
      subCategory => !subCategory.startsWith(categoryName)
    );
    setSelectedSubcategoryItems(updatedSelectedSubcategories);
  };





  const handleDeleteSelectedSubcategory = (subcategoryName: string, parentCategoryName: string) => {
    // Remove the selected subcategory from the array
    const updatedSelectedSubcategories = selectedSubcategoryItems.filter(
      subCategory => subCategory !== subcategoryName
    );
    setSelectedSubcategoryItems(updatedSelectedSubcategories);

    // Uncheck the subcategory
    setSelectedCategory((prevSelectedCategory: string) => {
      if (prevSelectedCategory && prevSelectedCategory.startsWith(parentCategoryName)) {
        return prevSelectedCategory !== parentCategoryName + '/' + subcategoryName
          ? prevSelectedCategory
          : null;
      }
      return prevSelectedCategory;
    });
  };

  const handleClearAll = () => {
    // Clear all selected categories and subcategories
    setSelectedItems([]);
    setSelectedSubcategoryItems([]);
    setSelectedCategory(null);
  };

  const SelectedCategoryDetails: React.FC<{ category: any }> = ({ category }) => {
    const isSelected = selectedCategory === category.id;
  
    const filteredSubcategories = category.sub_categories.filter((subCategory: any) =>
      subCategory.name.toLowerCase().includes(childSearchQuery.toLowerCase())
    );
  
    if (isSelected || selectedItems.includes(category.root_menu)) {
      return (
        <div>
          <ul>
            {filteredSubcategories.map((subCategory: any) => (
              <li key={subCategory.sub_id} className='text-sm p-1 cursor-pointer'>
                <input
                  type="checkbox"
                  checked={selectedSubcategoryItems.includes(subCategory.name)}
                  onChange={() => handleCheckboxChange(subCategory.name, true)}
                  className="mr-2"
                />
                {subCategory.name}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  
    return null;
  };

  
  

  return (
    <div className="productsSideBarContainer">
        <div className='topCategory flex justify-between mb-4'>
            <div className="filterInfo font-bold w-[70%]">Selected Filter</div>
                <div className="rightInfo text-sm font-semibold flex justify-between text-center text-blue-600 w-[30%] ponter cursor-pointer" onClick={handleClearAll}>
                    <span className="color-[blue]">Clear all</span> 
                    <ClearOutlinedIcon sx={{ color: "gray", fontSize: 14 }}/>
                </div>
        </div>
     <div className="selectedCategoriesItms flex mb-4">

        {selectedItems.map((selectedCategoryName: string) => (
            <div key={selectedCategoryName} className="selectedProductCategory">
                <span className="font-sm font-bold mr-1">Category:</span>{selectedCategoryName}
                <button
                onClick={() => handleDeleteSelectedCategory(selectedCategoryName)}
                className="deleteBtn"
                >
                 <ClearOutlinedIcon sx={{ color: "gray", fontSize: 14 }}/>
                </button>
            </div>
        ))}

        {selectedSubcategoryItems.map((selectedSubcategoryName: string) => (
            <div key={selectedSubcategoryName} className="selectedProductCategory">
               <span className="font-sm font-bold mr-1">Sub Category:</span> {selectedSubcategoryName}
                <button
                onClick={() => handleDeleteSelectedSubcategory(selectedSubcategoryName, '')}
                className="deleteBtn"
                >
                <ClearOutlinedIcon sx={{ color: "gray", fontSize: 18 }} />
                </button>
            </div>
        ))}

     </div>
      <div className="parentBarCategories">
        <div className="categoryholder flex justify-between">
          <div className="categories flex w-[90%]">
            <div className="catInfo w-[20%] font-bold mr-2 mt-1 mb-1">Category</div>
            <div className="selectedCategories overflow-hidden flex justify-center w-[80%] ">
                  {/* Display selected categories with delete option */}
              {selectedItems.map((selectedCategoryName: string) => (
                <span key={selectedCategoryName} className="selectedCategoryItems mr-1 text-sm flex justify-center ">
                  {selectedCategoryName}
                  
                </span>
              ))}
            </div>
          </div>
          <KeyboardArrowUpOutlinedIcon />
        </div>
        <div className="inputholder">
          <SearchOutlinedIcon sx={{
            color: "gray",
            fontSize: 16,
            marginRight: "5px",
          }}
          />
          <input
            id="searchcategory"
            placeholder='Search Category'
            onChange={handleSearchChange}
          />
        </div>

        <div className={`parentTop ${showAll ? 'scrollMe' : ''}`}>
          {filteredCategories.slice(0, displayCount).map((category: any) => (
            <div
              key={category.id}
              
              className={`flex  p-1 text-sm cursor-pointer `}
            >
              <div>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(category.root_menu)}
                  onChange={() => handleCheckboxChange(category.root_menu)}
                  className="mr-2"
                />
                {category.root_menu} ({countSubcategories(category)})
              </div>
            </div>
          ))}
        </div>
        

       
        {categories.length > displayCount && (
            <div className='w-[85%] mt-4 flex justify-left mb-2'>
          <span onClick={handleSeeMoreClick} className='font-semibold font-sm see-more text-blue-600 cursor cursor-pointer'>
            See More ({showAll ? hiddenCategoriesCount : hiddenFilteredCategoriesCount})
          </span>
          </div>
        )}
      </div>
      <div className='childrenBarCategories'>
        <div className='subCategories'>
                <div className="categoryholder flex justify-between">
                    <div className="categories flex w-[95%]">
                        <div className="catInfo w-[35%] font-bold mr-2 mt-1 mb-1 flex">Sub Category</div>
                        <div className="selectedCategories overflow-hidden flex justify-center w-[65%] ">
                        {selectedSubcategoryItems.map((selectedSubcategoryName: string) => (
                        <span key={selectedSubcategoryName} className="selectedCategoryItems mr-1 text-sm flex justify-center">
                            {selectedSubcategoryName}
                        </span>
                        ))}
                        </div>
                    </div>
                    <KeyboardArrowUpOutlinedIcon />
                </div>
                <div className="inputholder">
                    <SearchOutlinedIcon sx={{
                        color: "gray",
                        fontSize: 16,
                        marginRight: "5px",
                    }}
                    />
                    <input
                        id="searchSubcategory"
                        placeholder='Search Sub Category'  
                        value={childSearchQuery}
                        onChange={(e) => setChildSearchQuery(e.target.value)}                  
                        />

                </div>
        </div>
        {filteredCategories.map((category: any) => (
          <SelectedCategoryDetails key={category.id} category={category} />
        ))}
      </div>
      
    </div>
    
  );
};

export default Menus;
