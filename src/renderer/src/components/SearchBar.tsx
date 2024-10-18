import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Stock } from '@shared/models';
import { Link, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { activeStocksAtom } from '@renderer/store';


const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const activeStocks = useAtomValue(activeStocksAtom)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate()

  //gets closest listing
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0 && activeStocks) {
      const matches = findClosestStocks(term, activeStocks)
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
    setIsDropdownVisible(true); // Show dropdown when typing
  };
  //on entering gets closest matching
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Call your function here when Enter is pressed
      setIsDropdownVisible(false)
      nav(`/stock/${ suggestions[0] ? suggestions[0].symbol : searchTerm}`)
    }
  };
  
  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false); // Hide dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef]);

  const findClosestStocks = (term, stocks:Stock[]) => {
    const lowerTerm = term.toLowerCase();
    return stocks
      .filter(stock => stock.symbol.toLowerCase().includes(lowerTerm) || stock.name.toLowerCase().includes(lowerTerm))
      .sort((a, b) => {
        const startsWithOuA = a.symbol.toLowerCase().startsWith(lowerTerm);
        const startsWithOuB = b.symbol.toLowerCase().startsWith(lowerTerm);
        
        return startsWithOuA === startsWithOuB ? 0 : startsWithOuA ? -1 : 1;
      })
      .slice(0, 4)
  };

  const truncateName = (name: string) => {
    return name.length > 10 ? `${name.slice(0, 34)}...` : name;
  };

  return (
    <div className="py-0.5 m-1 non-draggable relative z-[999]" ref={searchBarRef}>
      <input
        type="text"
        placeholder="Search for a stock..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-60 p-1 mt-1/2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 relative z-[999]"
        onFocus={() => setIsDropdownVisible(true)} 
        onKeyDown={handleKeyDown}
        
      />
      {isDropdownVisible && suggestions.length > 0 && (
        <ul className="w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg absolute z-[999]">
          {suggestions.map((stock, index) => (
            <Link 
              onClick={() => setIsDropdownVisible(false)}
              to={`/stock/${stock.symbol}`} 
              key={index} 
              className="px-4 py-1 hover:bg-gray-100 cursor-pointer flex flex-col relative z-[999]">
              {stock.symbol}
              <p className='text-xs text-gray-400'>{truncateName(stock.name)}</p>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar