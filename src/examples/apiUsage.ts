/**
 * API 使用示例
 * 这个文件展示了如何使用新的API接口
 */

import React from 'react';
import { API } from '@/services/api';
import { AdminAuth } from '@/utils/auth';
import { ApiError } from '@/utils/request';
import { useApi, usePagination } from '@/hooks/useApi';

// ==================== 认证示例 ====================

/**
 * 登录示例
 */
export async function loginExample() {
  try {
    const success = await AdminAuth.login('admin', 'password');
    if (success) {
      console.log('登录成功');
      const user = AdminAuth.getCurrentUser();
      console.log('当前用户:', user);
    }
  } catch (error) {
    const errorMessage = AdminAuth.getLoginErrorMessage(error);
    console.error('登录失败:', errorMessage);
  }
}

/**
 * 登出示例
 */
export async function logoutExample() {
  try {
    await AdminAuth.logout();
    console.log('登出成功');
  } catch (error) {
    console.error('登出失败:', error);
  }
}

// ==================== 照片管理示例 ====================

/**
 * 获取照片列表示例
 */
export async function getPhotosExample() {
  try {
    const response = await API.Photo.getPhotoList({
      page: 1,
      per_page: 12,
      search: '风景'
    });
    
    console.log('照片列表:', response.data.photos);
    console.log('分页信息:', response.data.pagination);
  } catch (error) {
    console.error('获取照片列表失败:', error);
  }
}

/**
 * 上传照片示例
 */
export async function uploadPhotoExample(file: File) {
  try {
    const response = await API.Photo.uploadPhoto(file);
    if (response.success) {
      console.log('照片上传成功');
    }
  } catch (error) {
    console.error('照片上传失败:', error);
  }
}

/**
 * 更新照片信息示例
 */
export async function updatePhotoExample(photoId: string) {
  try {
    const response = await API.Photo.updatePhoto(photoId, {
      title: '新标题',
      description: '新描述',
      is_public: true,
    });
    
    if (response.success) {
      console.log('照片信息更新成功');
    }
  } catch (error) {
    console.error('照片信息更新失败:', error);
  }
}

/**
 * 删除照片示例
 */
export async function deletePhotoExample(photoId: string) {
  try {
    const response = await API.Photo.deletePhoto(photoId);
    if (response.success) {
      console.log('照片删除成功');
    }
  } catch (error) {
    console.error('照片删除失败:', error);
  }
}

// ==================== 公开API示例 ====================

/**
 * 获取公开照片示例
 */
export async function getPublicPhotosExample() {
  try {
    const response = await API.Public.getPublicPhotoList({
      page: 1,
      per_page: 12
    });
    
    console.log('公开照片列表:', response.data.photos);
  } catch (error) {
    console.error('获取公开照片失败:', error);
  }
}

// ==================== React Hook 使用示例 ====================

/**
 * 在 React 组件中使用 API Hook 的示例
 */
export function PhotoListComponent() {
  // 使用基础 API Hook
  const { data: stats, loading: statsLoading, execute: loadStats } = useApi({
    onSuccess: (data) => console.log('统计数据加载成功:', data),
    onError: (error) => console.error('统计数据加载失败:', error),
  });

  // 使用分页 Hook
  const {
    data: photos,
    loading: photosLoading,
    error: photosError,
    hasMore,
    loadData,
    loadMore,
    refresh
  } = usePagination(
    (page, perPage) => API.Photo.getPhotoList({ page, per_page: perPage }),
    12
  );

  // 组件挂载时加载数据
  React.useEffect(() => {
    loadStats(() => API.Dashboard.getStats());
    loadData(1);
  }, [loadStats, loadData]);

  return (
    <div>
      <h2>仪表板统计</h2>
      {statsLoading ? <div>加载中...</div> : <div>{JSON.stringify(stats)}</div>}
      
      <h2>照片列表</h2>
      {photosLoading ? <div>加载中...</div> : null}
      {photosError ? <div>错误: {photosError}</div> : null}
      
      <div>
        {photos.map(photo => (
          <div key={photo.id}>
            <img src={photo.thumbnail} alt={photo.title} />
            <h3>{photo.title}</h3>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button onClick={loadMore} disabled={photosLoading}>
          加载更多
        </button>
      )}
      
      <button onClick={refresh}>刷新</button>
    </div>
  );
}

// ==================== 错误处理示例 ====================

/**
 * 统一错误处理示例
 */
export async function handleApiErrorExample() {
  try {
    await API.Photo.getPhotoList();
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          console.log('未授权，请重新登录');
          // 跳转到登录页
          break;
        case 403:
          console.log('权限不足');
          break;
        case 404:
          console.log('资源不存在');
          break;
        case 500:
          console.log('服务器错误');
          break;
        default:
          console.log('请求失败:', error.message);
      }
    }
  }
} 