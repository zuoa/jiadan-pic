import React from 'react';
import { Typography } from 'antd';
import { CameraOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'umi';
import './index.less';
import '../../styles/minimalist.less';

const { Title } = Typography;

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = 'minimal-header' }) => {
  const location = useLocation();

  const navItems = [
    {
      key: '/gallery',
      icon: <CameraOutlined />,
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
      <div className="header-container">
        {/* Brand Section */}
        <Link to="/" className="brand-link">
          <div className="brand">
            <div className="brand-icon">
              <CameraOutlined />
            </div>
            <div className="brand-text">
              <Title level={4} className="brand-title">
                Jiadan
              </Title>
              <span className="brand-subtitle">Gallery</span>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="navigation">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
              <div className="nav-indicator"></div>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header; 