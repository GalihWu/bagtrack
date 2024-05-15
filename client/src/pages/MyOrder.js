import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import { GrLinkNext } from 'react-icons/gr';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import PageTitle from '../components/PageTitle';

function MyOrder() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const columns = [
    { header: 'No.' },
    { header: 'Baglog Yang Dipesan' },
    { header: 'Status' },
    { header: 'Tanggal Pesan' },
    { header: 'Action' },
  ];

  // Get all bookings by id
  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/bookings/get-bookings-by-user-id',
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking, index) => {
          return {
            ...booking,
            ...booking.baglog,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // delete bookings
  const deleteBooking = async (id) => {
    try {
      dispatch(ShowLoading());
      console.log(id);
      const response = await axiosInstance.post(
        '/api/bookings/delete-booking/',
        {
          _id: id,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.key !== id)
        );
        getBookings();
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
  const currentData = bookings.slice(indexOfFirstData, indexOfLastData);

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
    getBookings();
  }, []);

  return (
    <div>
      <PageTitle title="Bookings" />

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
                <td className="p-table">{item.status}</td>
                <td className="p-table">
                  {formatDate(new Date(item.createdAt))}
                </td>
                <td className="p-table">
                  <FaTrashAlt
                    className="pointer me-3"
                    onClick={() => deleteBooking(item.key)}
                  />
                  <GrLinkNext
                    className="pointer"
                    onClick={() => {
                      navigate(`/my-order/${item._id}`);
                    }}
                  />
                </td>

                {/* action */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="justify-content-center d-flex">
        <nav className="d-flex align-items-center gap-1">
          {bookings.length > dataPerPage &&
            Array.from({
              length: Math.ceil(bookings.length / dataPerPage),
            }).map((_, i) => (
              <button
                key={i}
                className={`pag rounded-md $ {
                  i + 1 === currentPage? 'orange-1 text-white' : ''
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

export default MyOrder;
