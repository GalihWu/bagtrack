import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
// import { useNavigate } from 'react-router-dom';

import '../resourses/auth.css';
import ico from '../assets/ico.png';

function Login() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/login', values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem('token', response.data.data);
        window.location.href = '/';
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Please fill in all required fields.');
    form.scrollToField(errorInfo.errorFields[0].name);
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="box p-4 pt-5">
        <div className="d-flex gap-2 justify-content-center align-items-center">
          <img src={ico} width={42} height={42} alt="ico" />
          <h1 className="text-lg fw-bold">Bagtrack</h1>
        </div>
        <hr />
        <Form
          layout="vertical"
          className="d-flex flex-column"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="d-flex flex-column gap-3">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email.',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email.',
                },
              ]}
            >
              <Input className="rounded" type="text" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password.',
                },
                {
                  min: 6,
                  message: 'Password must be at least 6 characters.',
                },
              ]}
            >
              <Input.Password className="rounded" type="password" />
            </Form.Item>
          </div>
          <div className="d-flex flex-column gap-3" style={{ width: '320px' }}>
            <div className="d-flex justify-content-between align-items-center my-3">
              <p className="text-p3">
                Don`t have an account yet?{' '}
                <Link className="cursor-pointer link" to="/register">
                  Register
                </Link>
              </p>
              <Button className="button5" type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
