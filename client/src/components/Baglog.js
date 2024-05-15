import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../resourses/cards.css';
import produk from '../assets//produk.jpg';

function Baglog({ baglog }) {
  const navigate = useNavigate();

  const formatRupiah = (angka) => {
    const rupiah = `Rp ${angka
      .toFixed(0)
      .replace(/,/g, '.')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return rupiah;
  };

  const harga = formatRupiah(baglog.price);

  const statusStock = () => {
    if (baglog.stock === true) {
      return '';
    } else {
      return 'Stock Habis';
    }
  };

  return (
    <div
      className="card pointer"
      onClick={() => {
        navigate(`/book-now/${baglog._id}`);
      }}
    >
      <img src={produk} alt="produk" width={200} height={200} />
      <div className="d-flex flex-column gap-2">
        <p>{baglog.name}</p>
        <p className="text-sm font-semibold ">{harga}</p>
        <p>{statusStock()}</p>
        <button className="button5">Beli Sekarang</button>
      </div>
    </div>
  );
}

export default Baglog;
