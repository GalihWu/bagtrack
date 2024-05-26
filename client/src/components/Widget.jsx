import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { FaUsers } from 'react-icons/fa';
import { IoMdCart } from 'react-icons/io';

const Widget = ({ totalOrders, totalIncome, users }) => {
  return (
    <div className="d-flex justify-content-between px-4">
      {/* Pendapatan */}
      <div
        className="d-flex flex-column gap-1 border border-2 rounded px-3 py-3 shadow-widget"
        style={{ width: '250px' }}
      >
        <div className="mb-2 d-flex justify-content-end">
          <LiaMoneyBillWaveSolid color="#389e0d" size={30} />
        </div>
        <div>Total Pendapatan</div>
        <div className="font-semibold">{totalIncome}</div>
      </div>

      {/* Pengguna */}
      <div
        className="d-flex flex-column gap-1 border border-2 rounded px-3 py-3 shadow-widget"
        style={{ width: '250px' }}
      >
        <div className="mb-2 d-flex justify-content-end">
          <FaUsers color="" size={30} />
        </div>
        <div>Total Pengguna</div>
        <div className="font-semibold">{users}</div>
      </div>

      {/* Pesanan */}
      <div
        className="d-flex flex-column gap-1 border border-2 rounded px-3 py-3 shadow-widget"
        style={{ width: '250px' }}
      >
        <div className="mb-2 d-flex justify-content-end">
          <IoMdCart color="#faad14" size={30} />
        </div>
        <div>Total Pesanan</div>
        <div className="font-semibold">{totalOrders}</div>
      </div>
    </div>
  );
};

export default Widget;
