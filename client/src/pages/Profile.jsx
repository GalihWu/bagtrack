import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { axiosInstance } from '../helpers/axiosInstance';
import PageTitle from '../components/PageTitle';

const Profile = () => {
  const [users, setUsers] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

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

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <PageTitle title={'Profile'} />
      {/* body */}
      <div className="d-flex justify-content-between">
        <div className="d-flex gap-4 flex-column">
          {/* Name Input */}
          <div className="d-flex flex-column gap-2">
            <div>Nama</div>
            <input
              type="text"
              style={{ width: '400px', height: '35px' }}
              className="border rounded px-2"
              value={users.name}
            />
          </div>
          {/* Phone Number Input */}
          <div className="flex flex-col gap-2">
            <div>No. HP</div>
            <input
              type="text"
              style={{ width: '400px', height: '35px' }}
              className="border rounded px-2"
              placeholder="Masukan No. HP anda"
              value={users.no_phone}
            />
          </div>
          {/* Address Input */}
          <div className="flex flex-col gap-2">
            <div>Alamat</div>
            <input
              type="text"
              style={{ width: '400px', height: '35px' }}
              className="border rounded px-2"
              placeholder="Masukan Alamat anda"
              value={users.address}
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
              src={users.photo || Profile}
              alt="profile"
              width={250}
              height={250}
            />
          </div>
        </div>
      </div>
      {/* Save Changes Button */}
      <div>
        <button className="secondary-btn" width={110}>
          Kembali
        </button>
        <button className="primary-btn ms-3" width={200}>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default Profile;
