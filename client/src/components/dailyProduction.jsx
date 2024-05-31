import React, { useState } from 'react';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { message } from 'antd';

const dailyProduction = () => {
  const [dailyProduction, setDailyProduction] = useState(4500);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/bookings/update-baglog', {
        dailyProduction,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success('Daily production updated successfully!');
        setDailyProduction(response.data.data.dailyProduction);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          defaultValue={dailyProduction}
          type="number"
          onChange={(e) => setDailyProduction(e.target.value)}
        />
        <button type="submit" className="primary-btn ms-3">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default dailyProduction;
