"use client"
import { IconButton, InputBase, Paper } from "@mui/material"
import React from "react"
import SearchIcon from "@mui/icons-material/Search"

const SearchInput = () => {
	return (
		<Paper
			component="form" className="searchForm"
		>
            <div className="searchBody">
			<input
				type="text"
				id="searchMe"
				name="search"
                placeholder="I am looking for..."
				className="searchInput"
			/>

			<div className="iconDiv">
				<SearchIcon className="searchIcon"	sx={{
                        fontSize: 18,
                    }}/>
            </div>
			
            </div>
		</Paper>
	)
}

export default SearchInput
