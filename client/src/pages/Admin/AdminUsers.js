import { message, Table } from 'antd';
// import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';

import PageTitle from '../../components/PageTitle';
import '../../resourses/table.css';
import { GrLinkNext } from 'react-icons/gr';
import Search from '../../components/Search';

function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

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

  function formatDate(date) {
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <PageTitle title="Users" />

      <Search placeholder={'Cari nama pengguna'} />

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
            {currentData.map((item, i) => (
              <tr key={i} className="even:bg-dark-yellow-30">
                <td className="p-table">
                  {i + 1 + (currentPage - 1) * dataPerPage}
                </td>
                <td className="p-table">{item.name}</td>
                <td className="p-table">{item.email}</td>
                <td className="p-table">
                  {formatDate(new Date(item.createdAt))}
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
