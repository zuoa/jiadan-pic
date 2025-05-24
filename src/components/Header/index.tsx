import React from 'react';
import { Typography } from 'antd';
import { PictureOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'umi';
import './index.less';

const { Title } = Typography;

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = 'header' }) => {
  const location = useLocation();

  const navItems = [
    {
      key: '/gallery',
      icon: <PictureOutlined />,
      label: 'Gallery',
      path: '/gallery',
    },
    {
      key: '/admin',
      icon: <SettingOutlined />,
      label: 'Admin',
      path: '/admin',
    },
  ];

  return (
    <header className={className}>
      <div className="header-content">
        <div className="brand-section">
          <div className="logo-container">
            <PictureOutlined className="logo-icon" />
            <Title level={3} className="logo">
              Jiadan Gallery
            </Title>
          </div>
          <div className="brand-tagline">
            Capturing Life's Beautiful Moments
          </div>
        </div>
        <nav className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header; 