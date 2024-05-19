import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

import PageTitle from '../components/PageTitle';
import profile from '../assets/profile2.jpg';
import Search from '../components/Search';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(15);

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/bookings/get-all-bookings',
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

  // Handle Search
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  const filteredBookings = bookings
    .filter((booking) =>
      booking.user.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((booking) => booking.status !== 'Selesai');

  const paginatedData = filteredBookings.slice(
    indexOfFirstData,
    indexOfLastData
  );
  // Mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div>
      <PageTitle title="Bookings" />
      <Search
        placeholder={'Cari nama pengguna'}
        value={searchText}
        onChange={handleSearch}
        searchText={searchText}
        onSearch={handleSearch}
      />

      <div className="mt-4 d-flex gap-5 flex-wrap">
        {paginatedData &&
          paginatedData.map((item, i) => (
            <div key={i} className="card-bookings position-relative">
              <p className="numbering">
                {i + 1 + (currentPage - 1) * dataPerPage}
              </p>
              <img
                src={profile}
                className="mb-2"
                alt="profile"
                width={160}
                height={160}
              />
              <div className="d-flex flex-column gap-2">
                <p className="text-sm">{item.user.name}</p>
                <p className="text-sm font-semibold ">
                  {item.totalOrder} baglog
                </p>
                <p className="text-sm">{item.status}</p>
              </div>
            </div>
          ))}
      </div>

      {/* pagination */}
      <div className="justify-content-center d-flex">
        <nav className="d-flex align-items-center gap-1">
          {filteredBookings.length > dataPerPage &&
            Array.from({
              length: Math.ceil(filteredBookings.length / dataPerPage),
            }).map((_, i) => (
              <button
                key={i}
                className={`page rounded-md ${
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

export default Bookings;
