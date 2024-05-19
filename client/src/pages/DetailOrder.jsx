import { GrFormPrevious, GrLocation } from 'react-icons/gr';
import { RiShoppingBasket2Line } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';

import Image from '../assets/produk.jpg';
import ico from '../assets/ico.png';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { message } from 'antd';
import { axiosInstance } from '../helpers/axiosInstance';
import { useEffect, useState } from 'react';

const DetailOrder = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [booking, setBooking] = useState(null); // inisialisasi subtotal dengan 0

  const getBooking = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/bookings/get-bookings-by-id/',
        {
          _id: params.id,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setBooking(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBooking();
  }, []);
  console.log(booking);
  return (
    <div className="detail-container px-[35px] py-[16px]">
      {/* title */}
      <div
        onClick={() => navigate('/my-order')}
        className="d-flex gap-3 my-3 align-items-center pointer"
      >
        <GrFormPrevious style={{ width: '26px', height: '26px' }} />
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
        <div className="d-flex gap-3 align-items-center ms-5">
          <img src={ico} alt="ico" width={30} height={30} />
          <div>BagTrack</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="ms-5 d-flex align-items-center">
            <img src={Image} alt="produk" width={40} height={40} />
            <div className="ms-3">Baglog Jamur Kuping</div>
          </div>
          <p className="">
            X <span>1000</span>
          </p>
        </div>
        <hr />
        <div className="d-flex gap-3 align-items-center font-semibold">
          <RiShoppingBasket2Line style={{ width: '20px', height: '20px' }} />
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
  );
};

export default DetailOrder;
