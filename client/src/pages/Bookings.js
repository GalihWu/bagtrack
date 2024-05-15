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
  const dispatch = useDispatch();

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
            numbering: index + 1,
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

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div>
      <PageTitle title="Bookings" />
      <Search placeholder={'Cari nama pengguna'} />

      <div className="mt-4 d-flex gap-5 flex-wrap">
        {bookings &&
          bookings.map((item, i) => (
            <div key={i} className="card-bookings position-relative">
              <p className="numbering">{item.numbering}</p>
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
    </div>
  );
}

export default Bookings;
