import React, { useState, useEffect, useRef } from 'react';
import { fetchCategories } from '@/services/category.service';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useRouter } from 'next/navigation';
import SkeletonList from '@/loaders/SkeletonList';

const INITIAL_DISPLAY_COUNT = 10;

const Header: React.FC = () => {

  const { push } = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addScrollbar, setAddScrollbar] = useState(false);

  const childCategoriesRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setLoading(true);
    fetchCategories(JSON.stringify({ categories: 'categories_tree_listing' }))
      .then((data) => {
        //console.log(JSON.stringify(data.data.root_menu));
        setCategories(data);

        if (data.length > 0) {
            setSelectedCategory(data[0].id);
        }
      })
      .catch((error) => {
        setError('Error fetching categories');
        //console.error('Error fetching categories:', error);
      })
      .finally(() => setLoading(false));
  }, []);

 

  if (loading) {
    return <div className="w-[400px] "><SkeletonList numberOfItems={5} /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (categories.length === 0) {
    return <div>No data available.</div>;
  }

  

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory((prevSelectedCategory: number) =>
      prevSelectedCategory === categoryId ? null : categoryId
    );

    // Scroll to the top of childrenCategories when a category is clicked
    if (childCategoriesRef.current) {
      childCategoriesRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewAllClick = () => {
    const newDisplayCount = displayCount + 5;
    setDisplayCount(newDisplayCount);
    
    // Check if the number of hidden items is greater than 3
    //if (categories.length - newDisplayCount > 3) {
      setAddScrollbar(true);
    //}
  };


  const SelectedCategoryDetails: React.FC<{ category: any }> = ({ category }) => {
    if (selectedCategory === category.id) {
      return (
        <div>
          {/*<h3>Sub-Categories of {category.root_menu}</h3>*/}
          <ul>
            {category.sub_categories.map((subCategory: any) => (
              <li key={subCategory.sub_id} 
              className='font-semibold p-1 cursor-pointer subLink' 
              >
                <a
                href={`/products?category=${encodeURIComponent(category.root_menu)}&subCategory=${encodeURIComponent(subCategory.name)}`}
              >
                {subCategory.name}
                </a>
                </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`productsContainer ${addScrollbar ? 'scrollbar' : ''}`} ref={childCategoriesRef}>
        <div className='parentCategories'>
            {/* Render your actual data here */}
            {categories.slice(0, displayCount).map((category: any) => (
                <div 
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex justify-between p-1 font-semibold cursor-pointer ${
                  selectedCategory === category.id ? 'default-color' : ''
                }`}
              >
                <div >
                    {category.root_menu}
                </div>
                <KeyboardArrowRightOutlinedIcon />

                </div>
            ))}

            {/* Add a "Show More" button */}
            {categories.length > displayCount && (
                <button onClick={handleViewAllClick} className='default-color font-semibold view-more mt-4 w-[85%]'>View All</button>
                
            )}
           
      </div>
      <div className='childrenCategories'>

            {/* Display selected category details */}
            {categories.map((category: any) => (
                <SelectedCategoryDetails key={category.id} category={category} />
            ))}
      </div>
    </div>
  );
};

export default Header;
