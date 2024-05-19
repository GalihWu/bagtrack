import { Col, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

import '../resourses/booknow.css';
import produk from '../assets/produk.jpg';
import PageTitle from '../components/PageTitle';

function BookNow() {
  // const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [baglog, setBaglog] = useState(null);
  const [quantity, setQuantity] = useState(0); // inisialisasi quantity dengan 1000
  const [subtotal, setSubtotal] = useState(0); // inisialisasi subtotal dengan 0

  const getBaglog = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/baglogs/get-baglog-by-id',
        {
          _id: params.id,
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

  const bookNow = async () => {
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
  };

  useEffect(() => {
    if (baglog) {
      setSubtotal(quantity * baglog.price);
    }
  }, [quantity, baglog]);

  const handleQuantityChange = (operation) => {
    let newQuantity = quantity;
    if (operation === 'add') {
      newQuantity = Math.min(Math.max(newQuantity + 1000, 1000), 10000); // Ensure quantity is between 1000 and 10000
    } else if (operation === 'subtract') {
      newQuantity = Math.max(newQuantity - 1000, 1000); // Don't go below minimum
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
                  <h2 className="text-lg mb-4">Atur Jumlah Pesanan</h2>
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
                  <div className="ms-4 font-semibold mt-4 py-3 border-bottom border-2 d-flex justify-content-between">
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
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr />
            {/* desc */}
            <div className="border mt-2  px-3 rounded py-2">
              <p className="indent">
                Baglog jamur kuping adalah medium pertumbuhan yang ideal untuk
                menghasilkan jamur kuping yang sehat. Dengan kualitas terbaik
                dan konsistensi yang terjamin, baglog jamur kuping memastikan
                pertumbuhan jamur yang subur dan beraroma tinggi. Dengan
                menggunakan baglog ini, Anda dapat menikmati pengalaman bercocok
                tanam jamur kuping secara mudah dan efektif, serta menikmati
                hasil panen yang segar dan berkualitas tinggi.
              </p>
            </div>

            {/* <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats : {selectedSeats.join(', ')}
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : {bus.fare * selectedSeats.length} /-
              </h1>
              <hr />

              <StripeCheckout
                billingAddress
                token={onToken}
                amount={bus.fare * selectedSeats.length * 100}
                currency="INR"
                stripeKey="pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ"
              >

              </StripeCheckout>
            </div> */}
          </Col>
          {/* <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col> */}
        </Row>
      )}
    </div>
  );
}

export default BookNow;
