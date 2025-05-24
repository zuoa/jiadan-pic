import React, { useState, useEffect } from 'react';
import { Image, Modal, Empty, Typography, Button, Input, message } from 'antd';
import { FullscreenOutlined, SettingOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import './index.less';
import '../../styles/layout.less';

const { Paragraph } = Typography;

interface Photo {
  id: string;
  title: string;
  description: string;
  src: string;
  thumbnail: string;
  date: string;
  category: string;
  isPrivate?: boolean;
}

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

  // 图片数据，包含公开和私有图片
  useEffect(() => {
    setTimeout(() => {
      setPhotos([
        // 公开图片（前4张）
        {
          id: '1',
          title: 'Mountain Reflection',
          description: 'A serene mountain landscape reflected in crystal clear waters during golden hour',
          src: 'https://picsum.photos/800/1200?random=1',
          thumbnail: 'https://picsum.photos/400/600?random=1',
          date: '2024-01-15',
          category: 'landscape',
          isPrivate: false,
        },
        {
          id: '2',
          title: 'Urban Nightscape',
          description: 'City lights painting the night sky with vibrant colors and energy',
          src: 'https://picsum.photos/800/600?random=2',
          thumbnail: 'https://picsum.photos/400/300?random=2',
          date: '2024-02-20',
          category: 'urban',
          isPrivate: false,
        },
        {
          id: '3',
          title: 'Forest Whispers',
          description: 'Sunlight filtering through ancient trees in a mystical forest',
          src: 'https://picsum.photos/800/1000?random=3',
          thumbnail: 'https://picsum.photos/400/500?random=3',
          date: '2024-03-10',
          category: 'nature',
          isPrivate: false,
        },
        {
          id: '4',
          title: 'Portrait in Light',
          description: 'Capturing the essence of human emotion through dramatic lighting',
          src: 'https://picsum.photos/800/1000?random=4',
          thumbnail: 'https://picsum.photos/400/500?random=4',
          date: '2024-04-05',
          category: 'portrait',
          isPrivate: false,
        },
        // 私有图片（需要验证才能查看）
        {
          id: '5',
          title: 'Ocean Dreams',
          description: 'Waves dancing under the moonlight on a peaceful beach',
          src: 'https://picsum.photos/800/800?random=5',
          thumbnail: 'https://picsum.photos/400/400?random=5',
          date: '2024-05-01',
          category: 'seascape',
          isPrivate: true,
        },
        {
          id: '6',
          title: 'Abstract Geometry',
          description: 'Modern architecture creating geometric patterns and shadows',
          src: 'https://picsum.photos/800/600?random=6',
          thumbnail: 'https://picsum.photos/400/300?random=6',
          date: '2024-05-15',
          category: 'abstract',
          isPrivate: true,
        },
        {
          id: '7',
          title: 'Wildlife Majesty',
          description: 'A majestic eagle soaring through mountain peaks',
          src: 'https://picsum.photos/800/900?random=7',
          thumbnail: 'https://picsum.photos/400/450?random=7',
          date: '2024-05-20',
          category: 'wildlife',
          isPrivate: true,
        },
        {
          id: '8',
          title: 'Street Art',
          description: 'Vibrant street art bringing color to urban walls',
          src: 'https://picsum.photos/800/1100?random=8',
          thumbnail: 'https://picsum.photos/400/550?random=8',
          date: '2024-05-25',
          category: 'street',
          isPrivate: true,
        },
        {
          id: '9',
          title: 'Desert Solitude',
          description: 'The vast beauty and isolation of desert landscapes',
          src: 'https://picsum.photos/800/700?random=9',
          thumbnail: 'https://picsum.photos/400/350?random=9',
          date: '2024-06-01',
          category: 'landscape',
          isPrivate: true,
        },
        {
          id: '10',
          title: 'Vintage Memories',
          description: 'A timeless portrait capturing the essence of bygone eras',
          src: 'https://picsum.photos/800/950?random=10',
          thumbnail: 'https://picsum.photos/400/475?random=10',
          date: '2024-06-10',
          category: 'vintage',
          isPrivate: true,
        },
        {
          id: '11',
          title: 'Autumn Symphony',
          description: 'Golden leaves creating a natural carpet in the forest',
          src: 'https://picsum.photos/800/1000?random=11',
          thumbnail: 'https://picsum.photos/400/500?random=11',
          date: '2024-06-15',
          category: 'nature',
          isPrivate: true,
        },
        {
          id: '12',
          title: 'Cosmic Wonder',
          description: 'Stars painting stories across the infinite night sky',
          src: 'https://picsum.photos/800/1200?random=12',
          thumbnail: 'https://picsum.photos/400/600?random=12',
          date: '2024-06-20',
          category: 'astronomy',
          isPrivate: true,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // 根据权限过滤图片
  const displayedPhotos = isAuthenticated ? photos : photos.filter(photo => !photo.isPrivate);

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
        {displayedPhotos.length === 0 ? (
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
            {displayedPhotos.map((photo) => (
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
                    <div className="meta-item">
                      <span className="meta-label">Category:</span>
                      <span className="meta-value">{previewData.category}</span>
                    </div>
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