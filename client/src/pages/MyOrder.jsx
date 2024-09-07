import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import { useReactToPrint } from 'react-to-print';

// ico
import { GrFormNextLink, GrLocation } from 'react-icons/gr';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { IoTrashBin } from 'react-icons/io5';
import ico from '../assets/ico.png';
import Image from '../assets/produk.jpg';
import { RiShoppingBasket2Line } from 'react-icons/ri';

// component
import PageTitle from '../components/PageTitle';
import confirm from 'antd/lib/modal/confirm';

function MyOrder() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    { header: 'No.' },
    { header: 'Baglog Yang Dipesan' },
    { header: 'Status' },
    { header: 'Tanggal Pesan' },
    { header: 'Estimasi Selesai' },
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
    confirm({
      title: 'Apakah kamu yakin menghapus pesanan ini?',
      content: 'Pesanan ini akan dihapus permanen',
      icon: <ExclamationCircleOutlined />,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      centered: false,
      maskClosable: true,
      onOk: async () => {
        try {
          dispatch(ShowLoading());
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
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);

  // Menghitung indeks data pertama dan terakhir untuk setiap halaman
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  // const currentData = bookings.slice(indexOfFirstData, indexOfLastData);

  const filteredBookings = bookings.filter(
    (booking) => booking.status !== 'Selesai'
  );

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
      <PageTitle title="Pesanan Saya" />

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
                <td className="p-table">{item.name}</td>
                <td className="p-table">{item.status}</td>
                <td className="p-table">
                  {moment(item.createdAt).format('DD-MM-YYYY')}
                </td>
                <td className="p-table">
                  {/* {item.estimationMin &&
                    `${moment(item.estimationMin).format(
                      'DD-MM-YYYY'
                    )} sampai `} */}
                  {item.estimationMax &&
                    moment(item.estimationMax).format('DD-MM-YYYY')}
                </td>
                <td className="p-table d-flex">
                  {!item.estimationMin && (
                    <IoTrashBin
                      title="Hapus Pesanan"
                      color="white"
                      className="pointer action"
                      style={{ backgroundColor: '#ff4d4f' }}
                      onClick={() => deleteBooking(item.key)}
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

                {/* action */}
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

export default MyOrder;
