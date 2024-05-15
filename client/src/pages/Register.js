import React from 'react';
import { Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import '../resourses/auth.css';

import ico from '../assets/ico.png';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/register', values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/login');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 box p-4 pt-5">
        <div className="d-flex gap-2 justify-content-center align-items-center">
          <img src={ico} width={42} height={42} />
          <h1 className="text-lg fw-bold">Bagtrack</h1>
        </div>
        <hr />
        <Form
          layout="vertical"
          className="d-flex flex-column gap-2"
          onFinish={onFinish}
        >
          <Form.Item label="Name" name="name">
            <input className="rounded" type="text" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <input className="rounded" type="text" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input className="rounded" type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <p className="text-p3">
              Already have an account?{' '}
              <Link className="cursor-pointer link" to="/login">
                Login
              </Link>
            </p>
            <button className="button5" type="submit">
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
