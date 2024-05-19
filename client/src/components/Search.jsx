import { FiSearch } from 'react-icons/fi';
import '../resourses/search.css';

const Search = ({ placeholder, value, onChange, onSearch }) => {
  return (
    <div className="search">
      <FiSearch className="fs-4" />
      <input
        className="input-search"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onSearch={onSearch}
      />
    </div>
  );
};

export default Search;
