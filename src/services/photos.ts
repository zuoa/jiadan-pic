import { HttpClient } from '@/utils/request';
import { PhotosResponse, PhotoListQuery } from '@/types/api';

// 创建HTTP客户端实例
const httpClient = new HttpClient();

// 获取照片列表
export async function getPhotos(params: PhotoListQuery = {}) {
  return httpClient.get<PhotosResponse>('/api/photos', {
    per_page: 12,
    page: 1,
    ...params,
  });
}

// 获取单张照片详情
export async function getPhoto(photoId: string) {
  return httpClient.get(`/api/photos/${photoId}`);
}

// 更新照片信息
export async function updatePhoto(photoId: string, data: any) {
  return httpClient.put(`/api/photos/${photoId}`, data);
}

// 删除照片
export async function deletePhoto(photoId: string) {
  return httpClient.delete(`/api/photos/${photoId}`);
}

// 上传照片
export async function uploadPhoto(formData: FormData) {
  return httpClient.upload('/api/photos/upload', formData);
} 