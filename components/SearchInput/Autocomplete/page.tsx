import React, { useState, useEffect } from "react";
import { Paper, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchDefaultSearch } from "@/services/product.service";
import useRouting from "@/hooks/routing";
import Link from 'next/link';

interface AutocompleteProps {
  handleSelected: (selectedItem: string) => void;
  handleSearch: (searchTerm: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  handleSelected,
  handleSearch,
}) => {
  const { setParam } = useRouting();

  const goToProduct = (path: string) => {
    setParam(path, "products", "search");
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<{ description: string; ingramPartNumber: string }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isItemSelected, setIsItemSelected] = useState<boolean>(false);
  const [delayedSearch, setDelayedSearch] = useState<NodeJS.Timeout | null>(
    null
  );
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState<boolean>(
    false
  );

  useEffect(() => {
    // Clear the timeout when the component unmounts or when the user stops typing
    return () => {
      if (delayedSearch) {
        clearTimeout(delayedSearch);
      }
    };
  }, [delayedSearch]);

  const handleSelect = (selectedItem: { description: string; ingramPartNumber: string }) => {
    setSearchTerm(selectedItem.description);
    setIsItemSelected(true);
    handleSelected(selectedItem.description);
    goToProduct(selectedItem.ingramPartNumber);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of form submission
      goToProduct(searchTerm); // Directly search the item on the products page
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsItemSelected(false); // Reset the state when the input changes

    // Clear the previous timeout to avoid making unnecessary requests
    if (delayedSearch) {
      clearTimeout(delayedSearch);
    }

    // Delay the API call for 500 milliseconds after the user stops typing
    setDelayedSearch(
      setTimeout(() => {
        if (searchTerm.trim() !== "") {
          setIsSearching(true);

          const payload = {
            keywords: searchTerm,
            pageSize: pageSize,
            pageNumber: pageNumber,
          };

          fetchDefaultSearch(JSON.stringify(payload))
            .then((data) => {
              //console.log(JSON.stringify(data));
              const suggestionsData = data.data.map(
                (product: { description: string; ingramPartNumber: string }) => ({
                  description: product.description,
                  ingramPartNumber: product.ingramPartNumber
                })
              );
              setSuggestions(suggestionsData);

              // Calculate total pages based on the total number of records and page size
              const totalPages = Math.ceil(data.recordsFound / pageSize);
              setTotalPages(totalPages);

              // Auto-increase pageNumber if it exceeds the total number of pages
              if (pageNumber >= totalPages) {
                setPageNumber((pageNumber) => pageNumber + 1);
              }
            })
            .catch((error) => {
              console.error("Error fetching suggestions:", error);
            })
            .finally(() => setIsSearching(false));
        }
      }, 500)
    );
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageNumber(1);
  };

  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true);
    handleSearch(searchTerm);
  };

  return (
    <Paper component="form" className="searchForm">
      <div className="searchBody">
        <input
          type="text"
          id="searchMe"
          name="search"
          placeholder="I am looking for..."
          className="searchInput"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
        />

        <div className="iconDiv">
          <SearchIcon
            className="searchIcon"
            sx={{ fontSize: 18 }}
            onClick={handleSearchButtonClick}
          />
        </div>
      </div>
      {isSearching ? (
        <div className="resutsLoader">Searching...</div>
      ) : searchTerm.trim() !== "" && !isItemSelected && suggestions.length > 0 ? (
        <div
          className={`resutsLoader${
            suggestions.length > 10 ? " scrollbar-2" : ""
          }`}
        >
          <ul className="suggestions">
            {suggestions.map((item, index) => (
              <li key={index} className="font-bold">
                <Link href={`/productdetail?id=${item.ingramPartNumber}`}>
                {item.description}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : isSearchButtonClicked && !isItemSelected && suggestions.length === 0 ? (
        <div className="resutsLoader">No results found.</div>
      ) : null}
    </Paper>
  );
};

export default Autocomplete;
