import { httpClient } from '@/utils/request';
import {
  LoginRequest,
  LoginResponse,
  PhotosResponse,
  PhotoListQuery,
  PublicPhotoListQuery,
  Photo,
  PhotoUpdate,
  DashboardStats,
  BaseResponse
} from '@/types/api';

/**
 * 认证相关API
 */
export class AuthAPI {
  /**
   * 登录
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/auth/login', credentials);
  }

  /**
   * 登出
   */
  static async logout(): Promise<BaseResponse> {
    return httpClient.post<BaseResponse>('/auth/logout');
  }

  /**
   * 验证token
   */
  static async verifyToken(): Promise<BaseResponse> {
    return httpClient.get<BaseResponse>('/auth/verify');
  }
}

/**
 * 照片管理API
 */
export class PhotoAPI {
  /**
   * 获取照片列表（需要认证）
   */
  static async getPhotoList(query: PhotoListQuery = {}): Promise<PhotosResponse> {
    return httpClient.get<PhotosResponse>('/photos', query);
  }

  /**
   * 获取单张照片详情（需要认证）
   */
  static async getPhotoDetail(photoId: string): Promise<BaseResponse<Photo>> {
    return httpClient.get<BaseResponse<Photo>>(`/photos/${photoId}`);
  }

  /**
   * 上传照片
   */
  static async uploadPhoto(file: File): Promise<BaseResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.upload<BaseResponse>('/photos/upload', formData);
  }

  /**
   * 更新照片信息
   */
  static async updatePhoto(photoId: string, data: PhotoUpdate): Promise<BaseResponse> {
    return httpClient.put<BaseResponse>(`/photos/${photoId}`, data);
  }

  /**
   * 删除照片
   */
  static async deletePhoto(photoId: string): Promise<BaseResponse> {
    return httpClient.delete<BaseResponse>(`/photos/${photoId}`);
  }
}

/**
 * 公开访问API
 */
export class PublicAPI {
  /**
   * 获取公开照片列表
   */
  static async getPublicPhotoList(query: PublicPhotoListQuery = {}): Promise<PhotosResponse> {
    return httpClient.get<PhotosResponse>('/public/photos', query);
  }

  /**
   * 获取公开照片详情
   */
  static async getPublicPhotoDetail(photoId: string): Promise<BaseResponse<Photo>> {
    return httpClient.get<BaseResponse<Photo>>(`/public/photos/${photoId}`);
  }
}

/**
 * 仪表板API
 */
export class DashboardAPI {
  /**
   * 获取仪表板统计信息
   */
  static async getStats(): Promise<DashboardStats> {
    return httpClient.get<DashboardStats>('/dashboard/stats');
  }
}

/**
 * 统一API导出
 */
export const API = {
  Auth: AuthAPI,
  Photo: PhotoAPI,
  Public: PublicAPI,
  Dashboard: DashboardAPI,
}; 