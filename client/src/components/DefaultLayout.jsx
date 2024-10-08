import React from 'react';
import '../resourses/layout.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaWhatsapp } from 'react-icons/fa';

import ico from '../assets/ico.png';
import profile from '../assets/profile.jpg';

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const userMenu = [
    {
      name: 'Home',
      icon: 'ri-home-line',
      path: '/',
    },
    {
      name: 'Pesanan Saya',
      icon: 'ri-shopping-bag-line',
      path: '/my-order',
    },
    {
      name: 'Antrean',
      icon: 'ri-file-list-line',
      path: '/bookings',
    },
    {
      name: 'Profil',
      icon: 'ri-user-line',
      path: '/profile',
    },
    {
      name: 'Logout',
      icon: 'ri-logout-box-line',
      path: '/logout',
    },
  ];
  const adminMenu = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: 'ri-dashboard-line',
    },
    // {
    //   name: 'Produk',
    //   path: '/admin/baglogs',
    //   icon: 'ri-add-box-line',
    // },
    {
      name: 'Pelanggan',
      path: '/admin/users',
      icon: 'ri-user-line',
    },
    {
      name: 'Pesanan',
      path: '/admin/bookings',
      icon: 'ri-archive-line',
    },
    {
      name: 'Pesanan Selesai',
      path: '/admin/orderCompleted',
      icon: 'ri-checkbox-multiple-line',
    },
    {
      name: 'Logout',
      path: '/logout',
      icon: 'ri-logout-box-line',
    },
  ];
  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  // if (window.location.pathname.includes('book-now')) {
  //   activeRoute = '/';
  // }

  return (
    <div className="layout-parent">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={ico} width={40} height={40} alt="ico" />
          <h1 className="role">{user?.isAdmin ? 'Admin' : ''} Bagtrack</h1>
        </div>
        <hr />
        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {menuToBeRendered.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  activeRoute === item.path && 'active-menu-item'
                } menu-item`}
              >
                <i className={item.icon}></i>
                {
                  <span
                    onClick={() => {
                      if (item.path === '/logout') {
                        localStorage.removeItem('token');
                        navigate('/login');
                      } else {
                        navigate(item.path);
                      }
                    }}
                  >
                    {item.name}
                  </span>
                }
              </div>
            );
          })}
        </div>
        <a href="https://wa.link/5eurxz" target="_blank" className="chat">
          <FaWhatsapp size={30} color="white" />
        </a>
        <div className="bottom">
          <img
            alt="profile"
            src={profile}
            width={30}
            height={30}
            className="rounded-circle me-3"
          />
          {user?.name}
        </div>
      </div>
      <div className="body">
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
