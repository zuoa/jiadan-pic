import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Button, Typography } from 'antd';
import { CameraOutlined, SettingOutlined, ExperimentOutlined } from '@ant-design/icons';
import '../styles/minimalist.less';

const { Title, Text } = Typography;

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // 页面加载动画
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // 实时时间更新
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  const navigateTo = (path: string) => {
    history.push(path);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className={`homepage ${isLoaded ? 'loaded' : ''}`}>
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-dot dot-1"></div>
        <div className="floating-dot dot-2"></div>
        <div className="floating-dot dot-3"></div>
      </div>

      {/* Main Content */}
      <div className="homepage-content">
        {/* Header Section */}
        <header className="homepage-header animate-fade-in">
          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
          
          <div className="brand-section">
            <Title level={1} className="brand-title">
              Jiadan
            </Title>
            <Text className="brand-subtitle">
              Visual Stories Collection
            </Text>
          </div>
        </header>

        {/* Navigation Grid */}
        <nav className="navigation-grid animate-slide-up">
          <div 
            className="nav-item primary interactive"
            onClick={() => navigateTo('/gallery')}
          >
            <div className="nav-icon">
              <CameraOutlined />
            </div>
            <div className="nav-content">
              <h3>Gallery</h3>
              <p>Explore visual stories</p>
            </div>
            <div className="nav-arrow">→</div>
          </div>

          <div 
            className="nav-item secondary interactive"
            onClick={() => navigateTo('/admin')}
          >
            <div className="nav-icon">
              <SettingOutlined />
            </div>
            <div className="nav-content">
              <h3>Admin</h3>
              <p>Manage content</p>
            </div>
            <div className="nav-arrow">→</div>
          </div>

          <div 
            className="nav-item tertiary interactive"
            onClick={() => navigateTo('/api-test')}
          >
            <div className="nav-icon">
              <ExperimentOutlined />
            </div>
            <div className="nav-content">
              <h3>API Test</h3>
              <p>Debug & monitor</p>
            </div>
            <div className="nav-arrow">→</div>
          </div>
        </nav>

        {/* Footer */}
        <footer className="homepage-footer animate-fade-in">
          <Text className="footer-text">
            Crafted with precision and care
          </Text>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .homepage {
          min-height: 100vh;
          background: var(--color-background);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transition: opacity var(--transition-slow);
        }

        .homepage.loaded {
          opacity: 1;
        }

        .background-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .floating-dot {
          position: absolute;
          width: 2px;
          height: 2px;
          background: var(--color-border);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .dot-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .dot-2 {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .dot-3 {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        .homepage-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: var(--space-3xl) var(--space-lg);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100vh;
          gap: var(--space-3xl);
        }

        .homepage-header {
          text-align: center;
          animation-delay: 0.1s;
        }

        .time-display {
          margin-bottom: var(--space-xl);
          opacity: 0.6;
        }

        .current-time {
          font-family: var(--font-family-mono);
          font-size: var(--font-size-2xl);
          font-weight: 300;
          color: var(--color-text-primary);
          margin-bottom: var(--space-xs);
        }

        .current-date {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .brand-section {
          margin-bottom: var(--space-lg);
        }

        .brand-title {
          font-size: var(--font-size-4xl) !important;
          font-weight: 200 !important;
          letter-spacing: -1px !important;
          margin-bottom: var(--space-sm) !important;
          color: var(--color-text-primary) !important;
        }

        .brand-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-text-secondary);
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .navigation-grid {
          display: grid;
          gap: var(--space-md);
          animation-delay: 0.3s;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-xl);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-background);
          transition: all var(--transition-base);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.02), transparent);
          transition: left var(--transition-slow);
        }

        .nav-item:hover::before {
          left: 100%;
        }

        .nav-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }

        .nav-item.primary:hover {
          border-color: var(--color-primary);
        }

        .nav-item.secondary:hover {
          border-color: var(--color-secondary);
        }

        .nav-item.tertiary:hover {
          border-color: var(--color-tertiary);
        }

        .nav-icon {
          font-size: var(--font-size-2xl);
          color: var(--color-text-secondary);
          transition: all var(--transition-base);
          min-width: 40px;
        }

        .nav-item:hover .nav-icon {
          color: var(--color-text-primary);
          transform: scale(1.1);
        }

        .nav-content {
          flex: 1;
        }

        .nav-content h3 {
          margin: 0 0 var(--space-xs) 0;
          font-size: var(--font-size-xl);
          font-weight: 500;
          color: var(--color-text-primary);
        }

        .nav-content p {
          margin: 0;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .nav-arrow {
          font-size: var(--font-size-xl);
          color: var(--color-text-muted);
          transition: all var(--transition-base);
          opacity: 0;
          transform: translateX(-10px);
        }

        .nav-item:hover .nav-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--color-text-primary);
        }

        .homepage-footer {
          text-align: center;
          animation-delay: 0.5s;
        }

        .footer-text {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .homepage-content {
            padding: var(--space-2xl) var(--space-md);
            gap: var(--space-2xl);
          }

          .brand-title {
            font-size: var(--font-size-3xl) !important;
          }

          .current-time {
            font-size: var(--font-size-xl);
          }

          .nav-item {
            padding: var(--space-lg);
            gap: var(--space-md);
          }

          .nav-icon {
            font-size: var(--font-size-xl);
            min-width: 32px;
          }

          .nav-content h3 {
            font-size: var(--font-size-lg);
          }
        }
        `
      }} />
    </div>
  );
}
