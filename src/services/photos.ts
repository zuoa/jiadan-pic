import { httpClient } from '@/utils/request';
import { PhotosResponse, PhotoListQuery, Photo, PhotoCreateRequest, PhotoUpdateRequest } from '@/types/api';

// 获取照片列表（管理员）
export async function getPhotos(params: PhotoListQuery = {}) {
  return httpClient.get<PhotosResponse>('/photos', {
    per_page: 12,
    page: 1,
    ...params,
  });
}

// 获取公开照片列表（不需要认证）
export async function getPublicPhotos(params: PhotoListQuery = {}) {
  return httpClient.get<PhotosResponse>('/public/photos', {
    per_page: 12,
    page: 1,
    ...params,
  });
}

// 获取单张照片详情
export async function getPhoto(photoId: string) {
  return httpClient.get<Photo>(`/photos/${photoId}`);
}

// 创建照片
export async function createPhoto(data: PhotoCreateRequest) {
  return httpClient.post<Photo>('/photos', data);
}

// 更新照片信息
export async function updatePhoto(photoId: string, data: PhotoUpdateRequest) {
  return httpClient.put<Photo>(`/photos/${photoId}`, data);
}

// 删除照片
export async function deletePhoto(photoId: string) {
  return httpClient.delete(`/photos/${photoId}`);
}

// 上传照片
export async function uploadPhoto(formData: FormData) {
  return httpClient.upload('/photos/upload', formData);
}

// 批量删除照片
export async function batchDeletePhotos(photoIds: string[]) {
  return httpClient.post('/photos/batch-delete', { ids: photoIds });
}

// 批量更新照片状态
export async function batchUpdatePhotos(photoIds: string[], updates: Partial<PhotoUpdateRequest>) {
  return httpClient.post('/photos/batch-update', { ids: photoIds, updates });
}

// 切换照片公开状态
export async function togglePhotoVisibility(photoId: string, isPublic: boolean) {
  return httpClient.patch<Photo>(`/photos/${photoId}/visibility`, { is_public: isPublic });
} 