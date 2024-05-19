import { message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import BaglogForm from '../../components/BaglogForm';
import PageTitle from '../../components/PageTitle';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';

function AdminBaglogs() {
  const dispatch = useDispatch();
  const [showBaglogForm, setShowBaglogForm] = useState(false);
  const [baglogs, setBaglogs] = useState([]);
  const [selectedBaglog, setSelectedBaglog] = useState(null);
  const getBaglogs = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        '/api/baglogs/get-all-baglogs',
        {}
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

  const deleteBaglog = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/baglogs/delete-baglog', {
        _id: id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBaglogs();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Number',
      dataIndex: 'number',
    },
    {
      title: 'From',
      dataIndex: 'from',
    },
    {
      title: 'To',
      dataIndex: 'to',
    },
    {
      title: 'Journey Date',
      dataIndex: 'journeyDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            class="ri-delete-bin-line"
            onClick={() => {
              deleteBaglog(record._id);
            }}
          ></i>
          <i
            class="ri-pencil-line"
            onClick={() => {
              setSelectedBaglog(record);
              setShowBaglogForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBaglogs();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Baglogs" />
        <button className="primary-btn" onClick={() => setShowBaglogForm(true)}>
          Add Baglog
        </button>
      </div>

      <Table columns={columns} dataSource={baglogs} />

      {showBaglogForm && (
        <BaglogForm
          showBaglogForm={showBaglogForm}
          setShowBaglogForm={setShowBaglogForm}
          type={selectedBaglog ? 'edit' : 'add'}
          selectedBaglog={selectedBaglog}
          setSelectedBaglog={setSelectedBaglog}
          getData={getBaglogs}
        />
      )}
    </div>
  );
}

export default AdminBaglogs;
