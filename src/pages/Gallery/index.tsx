import React, { useState, useEffect } from 'react';
import { Image, Modal, Empty, Typography, Button, Input, message } from 'antd';
import { FullscreenOutlined, SettingOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Link } from 'umi';
// 使用修复后的API服务
import { getPhotos, getPublicPhotos } from '@/services/photos';
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
        // 根据认证状态使用不同的API
        console.log('📨 调用照片API...');
        
        const response = isAuthenticated 
          ? await getPhotos({ per_page: 12, page: 1 })
          : await getPublicPhotos({ per_page: 12, page: 1 });
        
        console.log('📊 API响应:', response);
        
        if (response.success && response.data) {
          const photosData = response.data.photos || [];
          console.log(`✅ 成功获取 ${photosData.length} 张照片`);
          
          // 根据认证状态过滤照片
          const filteredPhotos = isAuthenticated 
            ? photosData 
            : photosData.filter((photo: Photo) => photo.is_public);
          
          setPhotos(filteredPhotos);
          
          if (filteredPhotos.length === 0) {
            message.info(isAuthenticated ? '暂无照片' : '暂无公开照片，请验证查看完整相册');
          }
        } else {
          console.warn('⚠️ API返回失败状态:', response);
          message.warning(response.message || '获取照片失败');
          setPhotos([]);
        }
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
            <p>All the beauty in this world is but a reflection of you.</p>
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
            {photos.map((photo, index) => (
              <div 
                key={photo.id} 
                className="photo-card-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="minimal-photo-card interactive" 
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
                      <div className="photo-info">
                        {photo.title && (
                          <h4 className="photo-title">{photo.title}</h4>
                        )}
                        {photo.description && (
                          <p className="photo-description">{photo.description}</p>
                        )}
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
          title={previewData?.title}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width="90%"
          centered
          destroyOnClose
        >
          {previewData && (
            <div className="modal-content">
              <Image
                alt="preview"
                src={previewData.src}
                className="modal-image"
                preview={false}
              />
              {previewData.description && (
                <div className="modal-description">
                  <p>{previewData.description}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Auth Modal */}
        <Modal
          open={authModalVisible}
          onCancel={() => {
            setAuthModalVisible(false);
            setPassword('');
          }}
          footer={null}
          className="auth-modal"
          destroyOnClose
          centered
        >
          <div className="auth-content">
            <h3 className="auth-title">Access Full Gallery</h3>
            <p className="auth-description">
              Enter password to view the complete collection
            </p>
            
            <Input.Password
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleAuth}
              size="large"
              autoFocus
            />
            
            <div className="auth-actions">
              <Button 
                onClick={() => {
                  setAuthModalVisible(false);
                  setPassword('');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                loading={authLoading}
                onClick={handleAuth}
                disabled={!password}
              >
                Verify
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Gallery; 