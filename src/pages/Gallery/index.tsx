import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, Modal, Empty, Typography, Button, Input, message, Spin } from 'antd';
import { FullscreenOutlined, SettingOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Link } from 'umi';
// 使用修复后的API服务
import { getPhotos, getPublicPhotos } from '@/services/photos';
import { Photo } from '@/types/api';
import './index.less';
import '../../styles/layout.less';

const { Paragraph } = Typography;

// 扩展Photo类型以包含尺寸信息
interface PhotoWithDimensions extends Photo {
  aspectRatio?: number;
  isPortrait?: boolean;
  isLandscape?: boolean;
  isSquare?: boolean;
}

const Gallery: React.FC = () => {
  const [processedPhotos, setProcessedPhotos] = useState<PhotoWithDimensions[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState<PhotoWithDimensions | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 分页相关状态
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 从0开始，表示未初始化
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // 权限验证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // 滚动加载相关
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false); // 防止重复加载

  // 正确的密码（实际项目中应该放在后端验证）
  const GALLERY_PASSWORD = 'jiadan2024';

  // 加载照片数据
  const loadPhotos = useCallback(async (page: number = 1, reset: boolean = false) => {
    if (loadingRef.current && !reset) {
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const response = isAuthenticated 
        ? await getPhotos({ per_page: 12, page })
        : await getPublicPhotos({ per_page: 12, page });
      
      if (response.success && response.data) {
        const newPhotos = response.data.photos || [];
        const pagination = response.data.pagination;
        
        if (reset || page === 1) {
          // 重置或第一页：直接设置新数据
          setPhotos(newPhotos);
          setCurrentPage(1);
        } else {
          // 追加数据：合并到现有数据
          setPhotos(prev => [...prev, ...newPhotos]);
          setCurrentPage(page);
        }
        
        // 更新是否还有更多数据
        const newHasMore = pagination ? page < pagination.pages : false;
        setHasMore(newHasMore);
        
        if (newPhotos.length === 0 && page === 1) {
          message.info(isAuthenticated ? '暂无照片' : '暂无公开照片，请验证查看完整相册');
        }
      } else {
        setError(response.message || '获取照片失败');
        if (page === 1) {
          setPhotos([]);
        }
      }
    } catch (err) {
      const errorMessage = '获取照片失败，请检查网络连接';
      setError(errorMessage);
      if (page === 1) {
        setPhotos([]);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 加载更多
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      loadPhotos(nextPage, false);
    }
  }, [hasMore, loading, currentPage, loadPhotos]);

  // 刷新数据
  const refresh = useCallback(() => {
    setPhotos([]);
    setProcessedPhotos([]);
    setCurrentPage(0);
    setHasMore(true);
    loadPhotos(1, true);
  }, [loadPhotos]);

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      // 处理多种日期格式
      let date: Date;
      
      // 如果是ISO格式的日期字符串
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
      } else if (dateString.includes('-')) {
        // 如果是YYYY-MM-DD格式
        date = new Date(dateString + 'T00:00:00');
      } else {
        // 其他格式
        date = new Date(dateString);
      }
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return dateString; // 如果无法解析，返回原字符串
      }
      
      const now = new Date();
      
      // 获取今天的日期（只比较年月日，忽略时分秒）
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const photoDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // 计算天数差异
      const diffTime = today.getTime() - photoDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return '今天';
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays === -1) {
        return '明天'; // 处理未来日期
      } else if (diffDays > 1 && diffDays <= 7) {
        return `${diffDays}天前`;
      } else if (diffDays < -1 && diffDays >= -7) {
        return `${Math.abs(diffDays)}天后`; // 处理未来日期
      } else if (diffDays > 7 && diffDays <= 30) {
        return `${Math.ceil(diffDays / 7)}周前`;
      } else if (diffDays < -7 && diffDays >= -30) {
        return `${Math.ceil(Math.abs(diffDays) / 7)}周后`; // 处理未来日期
      } else {
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.warn('日期格式化失败:', dateString, error);
      return dateString;
    }
  };

  // 图片尺寸检测函数
  const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // 处理照片数据并添加尺寸信息
  const processPhotosWithDimensions = async (photosData: Photo[]): Promise<PhotoWithDimensions[]> => {
    const processedPhotos = await Promise.all(
      photosData.map(async (photo) => {
        try {
          const dimensions = await getImageDimensions(photo.thumbnail);
          const aspectRatio = dimensions.width / dimensions.height;
          
          return {
            ...photo,
            aspectRatio,
            isPortrait: aspectRatio < 0.9,
            isLandscape: aspectRatio > 1.1,
            isSquare: aspectRatio >= 0.9 && aspectRatio <= 1.1,
          };
        } catch (error) {
          // 默认为正方形
          return {
            ...photo,
            aspectRatio: 1,
            isSquare: true,
          };
        }
      })
    );
    
    return processedPhotos;
  };

  // 初始化时检查本地存储的认证状态
  useEffect(() => {
    const savedAuth = localStorage.getItem('gallery-authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 初始化加载数据
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      loadPhotos(1, true);
    }
  }, [initialized, loadPhotos]);

  // 当认证状态改变时刷新数据
  useEffect(() => {
    if (initialized) { // 确保已经初始化
      refresh();
    }
  }, [isAuthenticated, refresh, initialized]);

  // 处理照片数据变化
  useEffect(() => {
    const processNewPhotos = async () => {
      if (photos.length === 0) {
        setProcessedPhotos([]);
        return;
      }

      setIsProcessing(true);
      try {
        // 根据认证状态过滤照片
        const filteredPhotos = isAuthenticated 
          ? photos 
          : photos.filter((photo: Photo) => photo.is_public);
        

        
        // 处理照片尺寸信息
        const newProcessedPhotos = await processPhotosWithDimensions(filteredPhotos);
        setProcessedPhotos(newProcessedPhotos);
        
        if (newProcessedPhotos.length === 0 && filteredPhotos.length === 0) {
          message.info(isAuthenticated ? '暂无照片' : '暂无公开照片，请验证查看完整相册');
        }
              } catch (error) {
        message.error('处理照片数据失败');
      } finally {
        setIsProcessing(false);
      }
    };

    processNewPhotos();
  }, [photos, isAuthenticated]);

  // 设置无限滚动观察器
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: [0, 0.1, 0.5, 1.0], // 多个阈值，更敏感
        rootMargin: '200px 0px 200px 0px' // 增加边距，提前触发
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadMore]); // 移除loading依赖，避免频繁重建观察器

  // 备用滚动监听器 - 更可靠的触发机制
  useEffect(() => {
    let lastTriggerTime = 0;
    const THROTTLE_DELAY = 500; // 500ms防抖

    const handleScroll = () => {
      if (!hasMore || loadingRef.current) return;

      const now = Date.now();
      if (now - lastTriggerTime < THROTTLE_DELAY) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 当滚动到距离底部400px时触发
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      
      if (distanceFromBottom < 400) {
        lastTriggerTime = now;
        loadMore();
      }
    };

    // 节流函数
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [hasMore, loadMore, currentPage]);

  const handlePreview = (photo: PhotoWithDimensions) => {
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

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const isInitialLoading = loading && processedPhotos.length === 0;

  if (isInitialLoading) {
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
        {processedPhotos.length === 0 && !loading && !isProcessing ? (
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
          <>
            <div className="gallery-masonry">
              {processedPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={`photo-card-wrapper ${
                    photo.isPortrait ? 'portrait' : 
                    photo.isLandscape ? 'landscape' : 'square'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div 
                    className="minimal-photo-card interactive" 
                    onClick={() => handlePreview(photo)}
                  >
                    <div className="photo-image-container">
                      <img
                        alt={photo.title || `Photo ${photo.id}`}
                        src={photo.src}
                        className="photo-image"
                        loading="lazy"
                        style={{
                          aspectRatio: photo.aspectRatio || 1
                        }}
                        onLoad={(e) => {
                          e.currentTarget.classList.add('loaded');
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      


                      {/* 日期悬浮显示 - 最终版本 */}
                      {(photo.date || photo.created_at) && (
                        <div 
                          className="photo-date-hover-final"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            zIndex: 10,
                            opacity: 0,
                            transform: 'translateY(-8px)',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            pointerEvents: 'none'
                          }}
                        >
                          {formatDate(photo.date || photo.created_at)}
                        </div>
                      )}
                      
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

            {/* 加载更多指示器 - 增大触发区域 */}
            {hasMore && (
              <div 
                ref={loadMoreRef} 
                className="load-more-trigger"
                style={{ 
                  height: '200px', // 增大高度，更容易触发
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  margin: '40px 0',
                  // 添加一些视觉提示
                  background: loading ? 'rgba(0, 102, 255, 0.05)' : 'transparent',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Spin size="small" />
                    <span style={{ color: '#666', fontSize: '14px' }}>Loading more photos...</span>
                  </div>
                ) : null}
              </div>
            )}



            {/* 处理中指示器 */}
            {isProcessing && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                margin: '20px 0',
                gap: '12px'
              }}>
                <Spin size="small" />
                <span style={{ color: '#666', fontSize: '14px' }}>Processing photos...</span>
              </div>
            )}
          </>
        )}

                {/* Preview Modal */}
        <Modal
          open={previewVisible}
          title={null}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width="90%"
          style={{ maxWidth: '800px' }}
          centered
          destroyOnClose
          className="photo-preview-modal-minimal"
          maskClosable={true}
        >
          {previewData && (
            <div className="preview-content">
              <img
                alt={previewData.title || 'Photo preview'}
                src={previewData.src}
                className="preview-img"
                onLoad={(e) => {
                  e.currentTarget.classList.add('loaded');
                }}
              />
              
              {/* Simple Info Bar */}
              {(previewData.title || previewData.description || previewData.date || previewData.location) && (
                <div className="preview-info">
                  {previewData.title && (
                    <h4 className="preview-title">{previewData.title}</h4>
                  )}
                  {previewData.description && (
                    <p className="preview-desc">{previewData.description}</p>
                  )}
                  
                  {/* Minimal Metadata */}
                  <div className="preview-meta">
                    {previewData.date && (
                      <span>{formatDate(previewData.date)}</span>
                    )}
                    {previewData.location && (
                      <span>{previewData.location}</span>
                    )}

                  </div>
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