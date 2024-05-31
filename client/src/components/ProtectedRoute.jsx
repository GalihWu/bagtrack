import React, { useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { SetUser } from '../redux/usersSlice';

import DefaultLayout from './DefaultLayout';
import Footer from './Footer';

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const navigate = useNavigate();
  const validateToken = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        '/api/users/get-user-by-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const user = response.data.data;
        if (user.isApproved === true) {
          dispatch(SetUser(user));
          if (user.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          message.error(
            'Your account is not approved yet. Please contact admin'
          );
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        localStorage.removeItem('token');
        message.error(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      dispatch(HideLoading());
      localStorage.removeItem('token');

      message.error(error.message);
      navigate('/login');
    }
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
      validateToken();
    } else {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname.includes('admin')) {
      if (user?.isAdmin === false) {
        message.error('You are not authorized to access this page');
        window.location.href = '/';
      }
    }
  }, [user]);

  return (
    <div>
      {user !== null && (
        <DefaultLayout>
          <div className="children">{children}</div>
          <Footer />
        </DefaultLayout>
      )}
    </div>
  );
}

export default ProtectedRoute;
