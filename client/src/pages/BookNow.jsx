import { Col, message, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../resourses/booknow.css';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

// ico
import { CheckCircleOutlined } from '@ant-design/icons';

// component
import produk from '../assets/produk.jpg';
import PageTitle from '../components/PageTitle';
import { RiErrorWarningLine } from 'react-icons/ri';

const { confirm } = Modal;

function BookNow() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [baglog, setBaglog] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get baglog
  const getBaglog = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/baglogs/get-baglog-by-id',
        {
          _id: '663ad95cb2e943260c6bb067',
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setBaglog(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Booking now
  const bookNow = async () => {
    confirm({
      title: 'Apakah anda ingin melanjutkan pesanan?',
      content: 'Pastikan jumlah yang anda masukkan benar',
      icon: <CheckCircleOutlined />,

      okText: 'Ya',
      okType: 'primary',
      cancelText: 'Tidak',
      centered: false,
      maskClosable: true,

      onOk: async () => {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.post('/api/bookings/book-seat', {
            baglog: baglog._id,
            totalOrder: quantity,
            totalPrice: baglog.price * quantity,
          });
          dispatch(HideLoading());
          console.log(response.data);
          if (response.data.success) {
            message.success(response.data.message);
            navigate('/bookings');
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

  useEffect(() => {
    if (baglog) {
      setSubtotal(quantity * baglog.price);
    }
  }, [quantity, baglog]);

  const handleQuantityChange = (operation) => {
    let newQuantity = quantity;
    if (operation === 'add') {
      newQuantity = Math.min(Math.max(newQuantity + 1000, 1000), 10000);
    } else if (operation === 'subtract') {
      newQuantity = Math.max(newQuantity - 1000, 1000);
    }
    setQuantity(newQuantity);
  };

  useEffect(() => {
    getBaglog();
  }, []);

  const formatRupiah = (angka) => {
    const rupiah = `Rp ${angka
      .toFixed(0)
      .replace(/,/g, '.')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return rupiah;
  };

  const harga = formatRupiah(subtotal);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <PageTitle title={'Pesan Baglog'} />
      {baglog && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={24} xs={24} sm={24}>
            <hr />

            <div className="d-flex gap-5">
              <img
                src={produk}
                className="rounded-2"
                width={320}
                height={360}
                alt="produk"
              />
              <div className="right-booknow">
                <h1 className="text-xl text-brown-2 ">{baglog.name}</h1>

                {/* atur pesanan */}
                <div className="bottom-right-booknow">
                  <h2 className="text-lg mb-2">Atur Jumlah Pesanan</h2>
                  <div className="text-end mb-2">
                    <RiErrorWarningLine
                      className="icons"
                      style={{ color: 'yellowgreen' }}
                      onClick={showModal}
                    />
                  </div>
                  <div className="d-flex gap-3 mb-4 justify-content-between">
                    <div className="text-gray-2 ps-4">
                      <p className="text-sm">Pemesanan kelipatan 1000 pcs</p>
                      <p className="text-sm">Max. pemesanan 10.000 pcs</p>
                    </div>
                    {/*  */}
                    <div className="quantity">
                      <div
                        className="setquantity pointer"
                        onClick={() => handleQuantityChange('subtract')}
                      >
                        -
                      </div>
                      <p>{quantity}</p>
                      <div
                        className="setquantity pointer"
                        onClick={() => handleQuantityChange('add')}
                      >
                        +
                      </div>
                    </div>
                  </div>

                  {/* subtotal */}
                  <div className="ms-4 font-semibold py-3 border-bottom border-2 d-flex justify-content-between">
                    <p>Subtotal</p>
                    <div className="d-flex gap-2">
                      <div className="text-h6 font-medium">{harga}</div>
                    </div>
                  </div>
                  <div className="mt-3 ms-4">
                    <button
                      className="button5"
                      disabled={quantity === 0}
                      onClick={() => bookNow()}
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* desc */}
            <hr />
            <div className="mt-2  px-3 rounded py-2">
              <h4>Deskripsi Produk</h4>
              <div className="mt-4 d-flex flex-column gap-3">
                <p className="text-sm">
                  ~ Baglog adalah media tanam jamur <br /> ~ Baglog sangat cocok
                  untuk yang ingin belajar budidaya jamur <br /> ~ Cukup siram
                  dengan menggunakan semprotan akan tumbuh jamur segar siap
                  panen
                </p>
                <p className="text-sm">
                  🍄 Cocok untuk yang ingin belajar menumbuhkan jamur dan
                  menikmati jamur segar bisa panen sendiri di rumah <br />
                  🍄 Baglog sudah melalui proses sterilisasi dan diisi bibit{' '}
                  <br />
                  🍄 Berat produk kurang lebih 1-1,2 kg <br />
                  🍄 Ukuran produk panjang 20 cm, diameter 10 cm <br />
                  🍄 Bisa panen beberapa kali.
                </p>
                <p className="text-sm">
                  Untuk perambatan miselium yang dikirim sesuai stok jika
                  meselium belum full harap ditunggu dulu sampai full
                </p>
                <p className="text-sm">Tanyakan stok sebelum membeli</p>
                <p className="text-sm">
                  Cara perawatan <br />
                  🍄 Taruh tempat lembab dan gelap yang tidak terkena sinar
                  matahari langsung dan tidak terkena curah hujan
                  <br />
                  🍄 Jika baglog belum putih menyeluruh maka harus didiamkan
                  dulu ±1-2minggu sampai putih menyeluruh <br />
                  🍄 Setelah bibit berwarna putih buka cincin hitam dan
                  penutupnya <br />
                  🍄 Semprot dengan air biasa(bukan air pam) pagi dan sore.
                  Hanya disemprot menggunakan semprotan, tidak boleh disiram{' '}
                  <br />
                  🍄 Penyemprotan bisa menggunakan air sumur/air cucian beras
                  <br /> 🍄 Waktu untuk tumbuh memerlukan waktu jadi harus sabar
                  ya
                </p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Modal
        title="Baca Ketentuan sebelum melakukan Pemesanan"
        visible={isModalVisible}
        onOk={handleOk}
        footer={[
          <button key="ok" onClick={handleOk} className="button5">
            OK
          </button>,
        ]}
        width={700}
      >
        <ul>
          <li>Pemesanan dilakukan secara online melalui situs web.</li>
          <li>
            Jumlah pesanan baglog dapat dimulai dari 1.000 baglog hingga 10.000
            baglog, dengan kelipatan 1.000.
          </li>
          <li>Pembayaran dapat dilakukan setelah baglog mulai dikirimkan.</li>
          <li>
            Pesanan hanya dapat dibatalkan jika status pemesanan masih dalam
            antrean atau belum diproses.
          </li>
        </ul>
      </Modal>
    </div>
  );
}

export default BookNow;
