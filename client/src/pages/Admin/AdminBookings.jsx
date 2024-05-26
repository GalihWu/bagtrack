import { message, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { useReactToPrint } from 'react-to-print';

// ico
import { GrFormNextLink, GrLocation } from 'react-icons/gr';
import { AiOutlineProduct, AiOutlineFileDone } from 'react-icons/ai';
import ico from '../../assets/ico.png';
import Image from '../../assets/produk.jpg';

// Component
import PageTitle from '../../components/PageTitle';
import Search from '../../components/Search';
import '../../resourses/table.css';
import { RiShoppingBasket2Line } from 'react-icons/ri';

import { CheckCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

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
    confirm({
      title: 'Proses Pesanan',
      content: `Apakah Anda yakin ingin mengubah status pesanan menjadi "Proses" untuk ${record.user.name}?`,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          dispatch(ShowLoading());
          let estimationMin, estimationMax;
          if (record.totalOrder <= 4500) {
            estimationMin = moment().add(15, 'days').format('YYYY-MM-DD');
            estimationMax = moment().add(20, 'days').format('YYYY-MM-DD');
          } else if (record.totalOrder > 4500 && record.totalOrder <= 9000) {
            estimationMin = moment().add(19, 'days').format('YYYY-MM-DD');
            estimationMax = moment().add(24, 'days').format('YYYY-MM-DD');
          } else {
            estimationMin = moment().add(23, 'days').format('YYYY-MM-DD');
            estimationMax = moment().add(28, 'days').format('YYYY-MM-DD');
          }

          const response = await axiosInstance.post(
            '/api/bookings/update-booking',
            {
              _id: record.key,
              status: 'Proses',
              estimationMin,
              estimationMax,
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
                  estimationMin,
                  estimationMax,
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
      },
    });
  };

  const handleStatusDone = async (record) => {
    confirm({
      title: 'Pesanan Selesai',
      content: `Apakah Anda yakin ingin mengubah status pesanan menjadi "Selesai" untuk ${record.user.name}?`,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
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
      },
    });
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
                  {item.estimationMin &&
                    `${moment(item.estimationMin).format(
                      'DD-MM-YYYY'
                    )} sampai `}
                  {item.estimationMax &&
                    moment(item.estimationMax).format('DD-MM-YYYY')}
                </td>
                {/* action */}
                <td className="p-table d-flex">
                  {item.status !== 'Proses' ? (
                    <AiOutlineProduct
                      className="pointer action"
                      color="white"
                      style={{ backgroundColor: '#fa8c16' }}
                      title="Proses Pesanan"
                      onClick={() => handleChangeStatus(item)}
                    />
                  ) : (
                    <AiOutlineFileDone
                      className="pointer action"
                      title="Pesanan Selesai"
                      color="white"
                      style={{ backgroundColor: '#22BB33' }}
                      onClick={() => handleStatusDone(item)}
                    />
                  )}
                  <GrFormNextLink
                    className="pointer action"
                    title="Detail Pesanan"
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
          <div className="d-flex flex-column p-4" ref={componentRef}>
            <div className="detail-container">
              {/* title */}
              <div className="d-flex gap-3 my-3 align-items-center pointer">
                <h1 className="text-xl font-medium"> Detail Pesanan</h1>
              </div>
              <hr />

              {/* body */}
              <div className="d-flex flex-column gap-4 mb-3">
                <div className="d-flex gap-3 align-items-center font-semibold">
                  <GrLocation style={{ width: '20px', height: '20px' }} />
                  <div>Alamat Pengiriman</div>
                </div>
                <div>
                  <p>Wahyu Triyanto</p>
                  <p>(+62) 81123456789</p>
                  <p>Jl Asia Afrika No 123 Kota Bandung 40526</p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                  <img src={ico} alt="ico" width={30} height={30} />
                  <div>BagTrack</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <img src={Image} alt="produk" width={40} height={40} />
                    <div className="ms-3">{selectedBooking.name}</div>
                  </div>
                  <p className="">
                    X <span>1000</span>
                  </p>
                </div>
                <hr />
                <div className="d-flex gap-3 align-items-center font-semibold">
                  <RiShoppingBasket2Line
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div>Detail Pesanan</div>
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-between pb-2">
                    <div>Harga /pcs</div>
                    <div>
                      Rp <span>2.000</span>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between font-semibold  mt-2">
                    <div>Subtotal</div>
                    <div>
                      Rp <span>2.000.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Bookings;
