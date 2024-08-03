// components/SearchBar.js
import { useState } from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <TextField
      label="Search Items"
      value={searchTerm}
      onChange={handleSearch}
      fullWidth
    />
  );
};

export default SearchBar;
