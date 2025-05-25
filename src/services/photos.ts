import { httpClient } from '@/utils/request';
import { PhotosResponse, PhotoListQuery } from '@/types/api';

// 获取照片列表
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
  return httpClient.get(`/photos/${photoId}`);
}

// 更新照片信息
export async function updatePhoto(photoId: string, data: any) {
  return httpClient.put(`/photos/${photoId}`, data);
}

// 删除照片
export async function deletePhoto(photoId: string) {
  return httpClient.delete(`/photos/${photoId}`);
}

// 上传照片
export async function uploadPhoto(formData: FormData) {
  return httpClient.upload('/photos/upload', formData);
} 