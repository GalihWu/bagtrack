import { message, Table } from 'antd';
// import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';

import PageTitle from '../../components/PageTitle';
import '../../resourses/table.css';
import Search from '../../components/Search';
import moment from 'moment';

function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');

  const columns = [
    { header: 'No.' },
    { header: 'Nama Pengguna' },
    { header: 'Email' },
    { header: 'Date at' },
    { header: 'Action' },
  ];

  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/users/get-all-users', {});
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);

  // Menghitung indeks data pertama dan terakhir untuk setiap halaman
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = users.slice(indexOfFirstData, indexOfLastData);

  // Mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredBookings = currentData.filter((booking) =>
    booking.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <PageTitle title="Users" />

      <Search
        placeholder={'Cari nama pengguna'}
        value={searchText}
        onChange={handleSearch}
        searchText={searchText}
        onSearch={handleSearch}
      />

      {/* body */}
      <div className="table-parent">
        <table className="table">
          <thead className="text-white orange-2">
            <tr>
              {columns &&
                columns.map((head, i) => (
                  <th key={i} className="p-table">
                    {head.header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredBookings &&
              filteredBookings.map((item, i) => (
                <tr key={i} className="even:bg-dark-yellow-30">
                  <td className="p-table">
                    {i + 1 + (currentPage - 1) * dataPerPage}
                  </td>
                  <td className="p-table">{item.name}</td>
                  <td className="p-table">{item.email}</td>
                  <td className="p-table">
                    {moment(item.createdAt).format('DD-MM-YYYY')}
                  </td>
                  <td className="p-table">?</td>

                  {/* action */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="justify-content-center d-flex">
        <nav className="d-flex align-items-center gap-1">
          {users.length > dataPerPage &&
            Array.from({
              length: Math.ceil(users.length / dataPerPage),
            }).map((_, i) => (
              <button
                key={i}
                className={`pag rounded-md ${
                  i + 1 === currentPage ? 'orange-1 text-white' : ''
                }`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
        </nav>
      </div>
    </div>
  );
}

export default AdminUsers;
