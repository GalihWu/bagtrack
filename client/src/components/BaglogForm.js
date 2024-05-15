import React from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import { axiosInstance } from '../helpers/axiosInstance';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
// import moment from "moment";

function BaglogForm({
  showBaglogForm,
  setShowBaglogForm,
  type = 'add',
  getData,
  selectedBaglog,
  setSelectedBaglog,
}) {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === 'add') {
        response = await axiosInstance.post('/api/baglogs/add-baglog', values);
      } else {
        response = await axiosInstance.post('/api/baglogs/update-baglog', {
          ...values,
          _id: selectedBaglog._id,
        });
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowBaglogForm(false);
      setSelectedBaglog(null);

      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };
  return (
    <Modal
      width={800}
      title={type === 'add' ? 'Add Baglog' : 'Update Baglog'}
      visible={showBaglogForm}
      onCancel={() => {
        setSelectedBaglog(null);
        setShowBaglogForm(false);
      }}
      footer={false}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={selectedBaglog}
      >
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Baglog Name" name="name">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Price" name="price">
              <input type="number" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Stock" name="stock">
              <select name="" id="">
                <option value={true}>Ada</option>
                <option value={false}>Kosong</option>
              </select>
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Description" name="desc">
              <input type="text" />
            </Form.Item>
          </Col>
          {/* image */}
          <Col lg={12} xs={24}>
            <Form.Item label="Img" name="img">
              <input type="image" alt="img" />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BaglogForm;
