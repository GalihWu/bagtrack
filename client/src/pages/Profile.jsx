import React, { useEffect, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { axiosInstance } from '../helpers/axiosInstance';
import PageTitle from '../components/PageTitle';
import profile from '../assets/profile.jpg';

import { CheckCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Profile = () => {
  const [users, setUsers] = useState({});
  // const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const getUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/users/get-user-by-id',
        {}
      );
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

  const showConfirm = (updatedUser) => {
    confirm({
      title: 'Apakah Anda yakin ingin memperbarui profil Anda?',
      icon: <CheckCircleOutlined />,
      content: 'Perubahan ini akan disimpan di database.',
      okText: 'Ya',
      cancelText: 'Batal',
      onOk() {
        updateUser(updatedUser);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const updateUser = async (updatedUser) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/users/update-user',
        updatedUser
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
        message.success('Profile updated successfully');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const updatedUser = {
      _id: users._id,
      name: formData.get('name'),
      no_phone: formData.get('no_phone'),
      address: formData.get('address'),
      // photo: formData.get('photo'),
    };
    showConfirm(updatedUser);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <PageTitle title={'Profile'} />
      {/* body */}
      <form ref={formRef} onSubmit={handleFormSubmit}>
        <div className="d-flex justify-content-between">
          <div className="d-flex gap-4 flex-column">
            {/* Name Input */}
            <div className="d-flex flex-column gap-2">
              <div>Nama</div>
              <input
                name="name"
                type="text"
                style={{ width: '400px', height: '35px' }}
                className="border rounded px-2"
                defaultValue={users.name}
              />
            </div>
            {/* Phone Number Input */}
            <div className="flex flex-col gap-2">
              <div>No. HP</div>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <p>+62</p>
                <input
                  name="no_phone"
                  type="number"
                  style={{ width: '360px', height: '35px' }}
                  className="border rounded px-2"
                  placeholder="Masukan No. HP anda"
                  defaultValue={users.no_phone}
                />
              </div>
            </div>
            {/* Address Input */}
            <div className="flex flex-col gap-2">
              <div>Alamat</div>
              <input
                name="address"
                type="text"
                style={{ width: '400px', height: '35px' }}
                className="border rounded px-2"
                placeholder="Masukan Alamat anda"
                defaultValue={users.address}
              />
            </div>
          </div>
          {/* Profile Image Upload */}
          <div className="d-flex flex-column me-4">
            <div
              style={{ width: '250px', height: '250px' }}
              className="overflow-hidden rounded-circle "
            >
              <img
                src={users.photo || profile}
                alt="profile"
                width={250}
                height={250}
              />
            </div>
            <input type="file" name="photo" />
          </div>
        </div>
        {/* Save Changes Button */}
        <div>
          <button type="submit" className="primary-btn ms-3">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
