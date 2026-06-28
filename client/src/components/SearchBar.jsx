import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ placeholder = 'Search for food, restaurants...', onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  let debounceTimer = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (onSearch) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onSearch(val);
      }, 400);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/vendors?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${className}`}
    >
      <div
        className={`flex items-center w-full bg-white rounded-2xl transition-all duration-300 ${
          focused
            ? 'shadow-card-hover ring-2 ring-primary/30'
            : 'shadow-card'
        }`}
      >
        <FiSearch
          className={`ml-4 text-xl flex-shrink-0 transition-colors duration-200 ${
            focused ? 'text-primary' : 'text-muted'
          }`}
        />
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-3 py-3.5 md:py-4 bg-transparent text-secondary placeholder-muted outline-none text-sm md:text-base font-medium"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 mr-1 rounded-xl text-muted hover:text-primary hover:bg-gray-100 transition-all duration-200"
          >
            <FiX />
          </button>
        )}
        <button
          type="submit"
          className="m-1.5 btn-primary text-sm py-2.5 px-5 rounded-xl flex-shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
