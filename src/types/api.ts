// API 基础响应类型
export interface BaseResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetail;
}

export interface ErrorDetail {
  code: string;
  message: string;
  details?: string;
}

// 认证相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface LoginData {
  token: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

// 验证查看密码相关类型
export interface VerifyPasswordRequest {
  password: string;
}

export interface VerifyPasswordResponse {
  success: boolean;
  message?: string;
}

// 照片相关类型
export interface Photo {
  id: string;
  title: string;
  description: string;
  src: string;
  thumbnail: string;
  date: string;
  size: string;
  location: string;
  is_public: boolean;
  file_name: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface PhotosResponse {
  success: boolean;
  message?: string;
  data: PhotosData;
}

export interface PhotosData {
  photos: Photo[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface PhotoUpdate {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  is_public?: boolean;
}

export interface PhotoCreateRequest {
  title: string;
  description?: string;
  date?: string;
  location?: string;
  is_public?: boolean;
  file_name: string;
  mime_type: string;
}

export interface PhotoUpdateRequest {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  is_public?: boolean;
}

// 查询参数类型
export interface PhotoListQuery {
  search?: string;
  per_page?: number;
  page?: number;
}

export interface PublicPhotoListQuery {
  per_page?: number;
  page?: number;
}

// 仪表板统计类型
export interface DashboardStats {
  success: boolean;
  data: StatsData;
}

export interface StatsData {
  total_photos: number;
  public_photos: number;
  private_photos: number;
  total_size: string;
  recent_uploads: Photo[];
} 