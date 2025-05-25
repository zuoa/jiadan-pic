// 生成的API适配器 - 保持与现有API接口的兼容性
import { apiClient, type Photo, type PhotosData, type LoginResponse, type Login, type PhotoUpdate } from '@/generated';
import type { 
  PhotosResponse, 
  PhotoListQuery, 
  PublicPhotoListQuery, 
  BaseResponse
} from '@/types/api';

// 响应数据适配器 - 处理AxiosResponse
function adaptResponse<T>(axiosResponse: any): T {
  const responseData = axiosResponse.data || axiosResponse;
  return {
    success: responseData.success !== false,
    data: responseData.data || responseData,
    message: responseData.message || 'Success'
  } as T;
}

function adaptError(error: any): any {
  return {
    success: false,
    message: error.message || 'API Error',
    error: error
  };
}

/**
 * 生成的认证API适配器
 */
export class GeneratedAuthAPI {
  static async login(credentials: Login): Promise<LoginResponse> {
    try {
      const response = await apiClient.auth.postLogin(credentials);
      return adaptResponse<LoginResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }

  static async logout(): Promise<BaseResponse> {
    try {
      const response = await apiClient.auth.postLogout();
      return adaptResponse<BaseResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }

  static async verifyToken(): Promise<BaseResponse> {
    try {
      const response = await apiClient.auth.getVerifyToken();
      return adaptResponse<BaseResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }
}

/**
 * 生成的照片API适配器
 */
export class GeneratedPhotoAPI {
  static async getPhotoList(query: PhotoListQuery = {}): Promise<PhotosResponse> {
    try {
      const params = {
        page: query.page || 1,
        per_page: query.per_page || 12,
        search: query.search
      };
      const response = await apiClient.photos.getPhotoList(params);
      return adaptResponse<PhotosResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }

  static async getPhotoDetail(photoId: string): Promise<BaseResponse<Photo>> {
    try {
      const response = await apiClient.photos.getPhotoDetail(photoId);
      return adaptResponse<BaseResponse<Photo>>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }

  static async uploadPhoto(file: File): Promise<BaseResponse> {
    try {
      // 注意：生成的API可能需要不同的上传方式
      const response = await apiClient.photos.postPhotoUpload();
      return adaptResponse<BaseResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }

  static async updatePhoto(photoId: string, data: PhotoUpdate): Promise<BaseResponse> {
    try {
      const response = await apiClient.photos.putPhotoDetail(photoId, data);
      return adaptResponse<BaseResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }

  static async deletePhoto(photoId: string): Promise<BaseResponse> {
    try {
      const response = await apiClient.photos.deletePhotoDetail(photoId);
      return adaptResponse<BaseResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }
}

/**
 * 生成的公开API适配器
 */
export class GeneratedPublicAPI {
  static async getPublicPhotoList(query: PublicPhotoListQuery = {}): Promise<PhotosResponse> {
    try {
      const params = {
        page: query.page || 1,
        per_page: query.per_page || 12
      };
      const response = await apiClient.public.getPublicPhotoList(params);
      return adaptResponse<PhotosResponse>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }

  static async getPublicPhotoDetail(photoId: string): Promise<BaseResponse<Photo>> {
    try {
      const response = await apiClient.public.getPublicPhotoDetail(photoId);
      return adaptResponse<BaseResponse<Photo>>(response);
    } catch (error) {
      throw adaptError(error);
    }
  }
}

/**
 * 生成的仪表板API适配器
 */
export class GeneratedDashboardAPI {
  static async getStats(): Promise<any> {
    try {
      const response = await apiClient.dashboard.getDashboardStats();
      return adaptResponse(response);
    } catch (error) {
      throw adaptError(error);
    }
  }
}

/**
 * 统一的生成API导出 - 与现有API接口兼容
 */
export const GeneratedAPI = {
  Auth: GeneratedAuthAPI,
  Photo: GeneratedPhotoAPI,
  Public: GeneratedPublicAPI,
  Dashboard: GeneratedDashboardAPI,
};

// 导出原始生成的API客户端（供高级用法）
export { apiClient as generatedApiClient };
export type { Photo, PhotosData, LoginResponse, Login }; 