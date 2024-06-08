import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';

// component
import PageTitle from '../../components/PageTitle';
import Chart from '../../components/Chart';
import Widget from '../../components/Widget';

function AdminHome() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Mendapatkan semua users
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/users/get-all-users', {});
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

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

  const totalOrders = bookings
    .filter((booking) => booking.status !== 'Selesai')
    .reduce((acc, current) => acc + current.totalOrder, 0)
    .toLocaleString('id-ID');

  const totalIncome = bookings
    .filter((booking) => booking.status === 'Selesai')
    .reduce((acc, current) => acc + current.totalPrice, 0)
    .toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

  const totalSubs = users.filter((user) => user.isAdmin === false).length;

  useEffect(() => {
    getUsers();
    getBookings();
  }, []);
  return (
    <>
      <PageTitle title={'Dashboard'} />

      {/* Body */}
      <div style={{ marginBottom: '80px' }}>
        <Widget
          totalIncome={totalIncome}
          totalOrders={totalOrders}
          users={totalSubs}
        />
      </div>
      <div className="">
        <hr />
        <Chart bookings={bookings} />
        <hr />
      </div>
    </>
  );
}

export default AdminHome;
