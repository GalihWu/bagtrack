import { FiSearch } from 'react-icons/fi';
import '../resourses/search.css';

const Search = ({ placeholder }) => {
  return (
    <div className="search">
      <FiSearch className="fs-4" />
      <input className="input-search" placeholder={placeholder} />
    </div>
  );
};

export default Search;
