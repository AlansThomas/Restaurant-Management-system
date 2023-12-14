/* eslint-disable react/prop-types */

import PropTypes from "prop-types"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCmp1SearchValue, getCmp2SearchValue } from "../../reducers/SearchReducer";

const SearchBar = ({ Search, searchCmp }) => {
  const [inputValue, setInputValue] = useState('');
  const cmp1SearchValue = useSelector(getCmp1SearchValue);
  const cmp2SearchValue = useSelector(getCmp2SearchValue);

  useEffect(() => {
    switch (searchCmp) {
      case 1:
        setInputValue(cmp1SearchValue);
        break;
      case 2:
        setInputValue(cmp2SearchValue);
        break;
      default:
        setInputValue('');
        break;
    }
  }, [searchCmp, cmp1SearchValue, cmp2SearchValue]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', height: '6rem', backgroundColor: 'rgb(248, 248, 248)', width: '70%', minHeight: '6rem' }}>
      <div style={{ width: '90%', height: '70%', display: 'flex', position: 'relative', padding: '10px 20px 10px 20px' }}>
        <div style={{ height: '100%', width: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
          <img src="/assets/searching.png" alt="Search Icon" style={{ height: '35px', width: '35px' }} />
        </div>
        <input
          type="text"
          onChange={(e) => Search(e)}
          style={{ height: '100%', width: '100%', outline: 'none' }}
          placeholder="Search for a cuisine..."
          defaultValue={inputValue}
        />
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  Search: PropTypes.func,
  searchCmp: PropTypes.any
}

export default SearchBar;
