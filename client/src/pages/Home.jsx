import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, message, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// Component
import Baglog from '../components/Baglog';
import PageTitle from '../components/PageTitle';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

function Home() {
  const { user } = useSelector((state) => state.users);
  const [filters = {}, setFilters] = useState({});
  const dispatch = useDispatch();
  const [baglogs, setBaglogs] = useState([]);

  // Get Baglogs
  const getBaglogs = async () => {
    const tempFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        tempFilters[key] = filters[key];
      }
    });
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        '/api/baglogs/get-all-baglogs',
        tempFilters,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setBaglogs(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBaglogs();
  }, []);

  return (
    <div>
      <PageTitle title={'Home'} />
      <Row gutter={[15, 15]}>
        {baglogs
          .filter((baglog) => baglog.stock === true)
          .map((baglog) => (
            <Col key={baglog._id} lg={12} xs={24} sm={24}>
              <Baglog baglog={baglog} />
            </Col>
          ))}
      </Row>
    </div>
  );
}

export default Home;
