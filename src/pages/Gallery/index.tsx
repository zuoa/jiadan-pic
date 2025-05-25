import React, { useState, useEffect } from 'react';
import { Image, Modal, Empty, Typography, Button, Input, message } from 'antd';
import { FullscreenOutlined, SettingOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Link } from 'umi';
// 注释掉旧的API导入，等待OpenAPI生成新的API
// import { API } from '@/services';
import { Photo } from '@/types/api';
import './index.less';
import '../../styles/layout.less';

const { Paragraph } = Typography;

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState<Photo | null>(null);
  
  // 权限验证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // 正确的密码（实际项目中应该放在后端验证）
  const GALLERY_PASSWORD = 'jiadan2024';

  // 初始化时检查本地存储的认证状态
  useEffect(() => {
    const savedAuth = localStorage.getItem('gallery-authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 获取照片数据
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      console.log('🔍 Gallery页面开始获取照片数据...');
      console.log('📊 当前认证状态:', isAuthenticated);
      
      try {
        // TODO: 使用OpenAPI生成的API
        console.log('📨 API将在OpenAPI生成后可用');
        
        // 临时设置空数组，等待API生成
        setPhotos([]);
        message.info('照片API将在OpenAPI生成后可用');
      } catch (error) {
        console.error('❌ API调用失败:', error);
        message.error('获取照片失败，请检查网络连接');
        setPhotos([]);
      } finally {
        setLoading(false);
        console.log('🏁 照片获取流程结束');
      }
    };

    fetchPhotos();
  }, [isAuthenticated]); // 当认证状态改变时重新获取照片

  const handlePreview = (photo: Photo) => {
    setPreviewData(photo);
    setPreviewVisible(true);
  };

  // 处理权限验证
  const handleAuth = async () => {
    setAuthLoading(true);
    
    // 模拟验证延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === GALLERY_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('gallery-authenticated', 'true');
      setAuthModalVisible(false);
      setPassword('');
      message.success('验证成功！现在可以查看完整相册了');
    } else {
      message.error('密码错误，请重试');
    }
    
    setAuthLoading(false);
  };

  // 退出权限验证
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gallery-authenticated');
    message.info('已退出完整模式');
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-animation">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <Paragraph style={{ marginTop: 24, fontSize: '16px', fontWeight: 500 }}>
            Curating beautiful moments...
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* 右下角控制按钮组 */}
      <div className="control-buttons">
        {/* Admin Button */}
        <Link to="/admin" className="admin-btn" title="Admin Panel">
          <SettingOutlined />
        </Link>

        {/* 权限控制按钮 */}
        <div className="auth-controls">
          {isAuthenticated ? (
            <div
              className="auth-btn authenticated"
              onClick={handleLogout}
              title="退出完整模式"
            >
              <UnlockOutlined />
            </div>
          ) : (
            <div
              className="auth-btn"
              onClick={() => setAuthModalVisible(true)}
              title="查看完整相册"
            >
              <LockOutlined />
            </div>
          )}
        </div>
      </div>

      <div className="gallery-container">
        {/* Header Section */}
        <div className="gallery-header">
          <div className="gallery-welcome">
            <h1>Jiadan Visual Stories</h1>
            <p>Where every frame tells a story and every moment becomes eternal</p>
          </div>
        </div>

        {/* Photo Grid */}
        {photos.length === 0 ? (
          <div className="empty-state">
            <Empty 
              description={
                <div className="empty-description">
                  <h3>No photos available</h3>
                  <p>Come back later to discover beautiful content</p>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-card-wrapper">
                <div 
                  className="minimal-photo-card" 
                  onClick={() => handlePreview(photo)}
                >
                  <div className="photo-image-container">
                    <img
                      alt={photo.title || `Photo ${photo.id}`}
                      src={photo.thumbnail}
                      className="photo-image"
                      loading="lazy"
                    />
                    
                    <div className="photo-overlay">
                      <div className="overlay-bottom">
                        <div className="photo-info">
                          {photo.title && <h4 className="photo-title">{photo.title}</h4>}
                          {photo.description && <p className="photo-description">{photo.description}</p>}
                          <div className="photo-meta">
                            <span className="photo-date">{photo.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        <Modal
          open={previewVisible}
          title={null}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width="90%"
          centered
          className="photo-preview-modal"
          destroyOnClose
        >
          <div className="modal-content">
            <div className="modal-image-section">
              <Image
                alt="preview"
                src={previewData?.src}
                className="preview-image"
                preview={false}
              />
            </div>
            
            {previewData && (
              <div className="modal-info-section">
                <div className="modal-header">
                  <h2 className="modal-title">{previewData.title}</h2>
                  <div className="modal-actions">
                    <Button
                      type="text"
                      icon={<FullscreenOutlined />}
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewData.src;
                        link.target = '_blank';
                        link.click();
                      }}
                    >
                      Full Size
                    </Button>
                  </div>
                </div>
                
                <div className="modal-details">
                  {previewData.description && (
                    <p className="modal-description">{previewData.description}</p>
                  )}
                  
                  <div className="modal-meta">
                    <div className="meta-item">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">{previewData.date}</span>
                    </div>
                    {previewData.location && (
                      <div className="meta-item">
                        <span className="meta-label">Location:</span>
                        <span className="meta-value">{previewData.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* 权限验证弹窗 */}
        <Modal
          title="查看完整相册"
          open={authModalVisible}
          onCancel={() => {
            setAuthModalVisible(false);
            setPassword('');
          }}
          footer={[
            <Button key="cancel" onClick={() => {
              setAuthModalVisible(false);
              setPassword('');
            }}>
              取消
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              loading={authLoading}
              onClick={handleAuth}
              disabled={!password}
            >
              验证
            </Button>
          ]}
          className="auth-modal"
          destroyOnClose
        >
          <div className="auth-content">
            <div className="auth-description">
              <LockOutlined style={{ fontSize: '48px', color: '#000000', marginBottom: '16px' }} />
              <p>需要密码才能查看完整相册。</p>
            </div>
            
            <Input.Password
              placeholder="请输入查看密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleAuth}
              size="large"
              style={{ marginTop: '24px' }}
              autoFocus
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Gallery; 