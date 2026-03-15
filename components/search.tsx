'use client';

import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Search and Close icons
import { erc20Abi } from "viem"
import { useReadContracts } from 'wagmi';
const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | undefined>(undefined);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };


const { data, isLoading, error } = useReadContracts({
    contracts: tokenAddress
      ? [
          {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'name',
          },

          { address: tokenAddress,
             abi: erc20Abi, 
             functionName: 'symbol' },

          { address: tokenAddress, 
            abi: erc20Abi, 
            functionName: 'totalSupply'},
          
        ]
      : [],

   query: {
      enabled: !!tokenAddress, 
    },        
  });

 //console.log(data)
  
  const handleIconClick = (e:React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault();
     let cleanedQuery = query.trim();
    if (cleanedQuery.toLowerCase().startsWith('0x')) {
  cleanedQuery = cleanedQuery.slice(2);
}
    const addr = `0x${cleanedQuery}` as `0x${string}`;
    setTokenAddress(addr);
  };

  return (
    <div className="flex items-center ">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleIconClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {query ? <FaTimes /> : <FaSearch />}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;