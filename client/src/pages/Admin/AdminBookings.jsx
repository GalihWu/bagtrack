import { message, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { useReactToPrint } from 'react-to-print';

// ico
import { GrFormNextLink } from 'react-icons/gr';
import { AiOutlineProduct, AiOutlineFileDone } from 'react-icons/ai';

// Component
import PageTitle from '../../components/PageTitle';
import Search from '../../components/Search';
import '../../resourses/table.css';

function Bookings() {
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

  // Menghitung indeks data pertama dan terakhir untuk setiap halaman
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  // Mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // table header
  const columns = [
    { header: 'No.' },
    { header: 'Nama Pengguna' },
    { header: 'Jumlah Pesanan' },
    { header: 'Total Tagihan' },
    { header: 'Status' },
    { header: 'Estimasi Waktu' },
    { header: 'Action' },
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

  //  Mengubah status dan menambahkan estimasi waktu
  const handleChangeStatus = async (record) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/bookings/update-booking',
        {
          _id: record.key,
          status: 'Proses',
          estimation: moment().add(9, 'days').format('YYYY-MM-DD'),
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success('Booking status updated successfully!');
        const updatedBookings = bookings.map((booking) => {
          if (booking.key === record.key) {
            return {
              ...booking,
              status: 'Proses',
              estimation: moment().add(9, 'days').format('YYYY-MM-DD'),
            };
          }
          return booking;
        });
        setBookings(updatedBookings);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const handleStatusDone = async (record) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/bookings/update-booking',
        {
          _id: record.key,
          status: 'Selesai',
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success('Booking status updated successfully!');
        const updatedBookings = bookings.map((booking) => {
          if (booking.key === record.key) {
            return {
              ...booking,
              status: 'Selesai',
            };
          }
          return booking;
        });
        setBookings(updatedBookings);
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
  const filteredBookings = bookings
    .filter((booking) =>
      booking.user.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((booking) => booking.status !== 'Selesai');

  const paginatedData = filteredBookings.slice(
    indexOfFirstData,
    indexOfLastData
  );

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
            {paginatedData.map((item, i) => (
              <tr key={i} className="even:bg-dark-yellow-30">
                <td className="p-table">
                  {i + 1 + (currentPage - 1) * dataPerPage}
                </td>
                <td className="p-table">{item.user.name}</td>
                <td className="p-table">{item.totalOrder}</td>
                <td className="p-table">{formattedPrice(item.totalPrice)}</td>
                <td className="p-table">{item.status}</td>
                <td className="p-table">
                  {item.estimation &&
                    moment(item.estimation).format('DD-MM-YYYY')}
                </td>
                {/* action */}
                <td className="p-table d-flex">
                  {item.status !== 'Proses' ? (
                    <AiOutlineProduct
                      className="pointer action"
                      onClick={() => handleChangeStatus(item)}
                    />
                  ) : (
                    <AiOutlineFileDone
                      className="pointer action"
                      onClick={() => handleStatusDone(item)}
                    />
                  )}
                  <GrFormNextLink
                    className="pointer action"
                    onClick={() => {
                      setSelectedBooking(item);
                      setShowPrintModal(true);
                    }}
                  />
                </td>
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
          title="Print Ticket"
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

export default Bookings;
