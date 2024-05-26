import { message, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { useReactToPrint } from 'react-to-print';

// Component
import PageTitle from '../../components/PageTitle';
import Search from '../../components/Search';
import '../../resourses/table.css';

function OrderCompleted() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);

  // table header
  const columns = [
    { header: 'No.' },
    { header: 'Nama Pengguna' },
    { header: 'Jumlah Pesanan' },
    { header: 'Total Tagihan' },
    { header: 'Pesanan Selesai' },
    { header: 'Status' },
  ];

  // mendapatkan data bookings
  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/bookings/get-all-bookings',
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
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

  // format price
  const formattedPrice = (price) =>
    price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Menghitung indeks data pertama dan terakhir untuk setiap halaman
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  const filteredBookings = bookings
    .filter((booking) =>
      booking.user.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((booking) => booking.status === 'Selesai');

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
    <div className="container-bookings">
      <PageTitle title="Bookings" />
      {/* search */}
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
              paginatedData.map((item, i) => (
                <tr key={i} className="even:bg-dark-yellow-30">
                  <td className="p-table">
                    {i + 1 + (currentPage - 1) * dataPerPage}
                  </td>
                  <td className="p-table">{item.user.name}</td>
                  <td className="p-table">{item.totalOrder}</td>
                  <td className="p-table">{formattedPrice(item.totalPrice)}</td>
                  <td className="p-table">
                    {moment(item.updatedAt).format('DD-MM-YYYY')}
                  </td>
                  <td className="p-table">{item.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
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

      {/* Modal */}
      {showPrintModal && (
        <Modal
          title="Print Pesanan"
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          visible={showPrintModal}
          okText="Print"
          onOk={handlePrint}
        >
          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>{selectedBooking.name}</p>
            <hr />
            <p>
              <span>Journey Date:</span>{' '}
              {moment(selectedBooking.journeyDate).format('DD-MM-YYYY')}
            </p>
            <p>
              <span>Journey Time:</span> {selectedBooking.departure}
            </p>
            <hr />
            <p>
              <span>Seat Numbers:</span> <br />
              {selectedBooking.seats}
            </p>
            <hr />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default OrderCompleted;
