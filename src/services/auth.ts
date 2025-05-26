import { httpClient } from '@/utils/request';
import { LoginRequest, LoginResponse, User, ChangePasswordRequest, ChangePasswordResponse } from '@/types/api';

// 登录
export async function login(credentials: LoginRequest) {
  return httpClient.post<LoginResponse>('/auth/login', credentials);
}

// 登出
export async function logout() {
  return httpClient.post('/auth/logout');
}

// 验证token
export async function verifyToken() {
  return httpClient.get('/auth/verify');
}

// 获取当前用户信息
export async function getCurrentUser() {
  return httpClient.get<User>('/auth/me');
}

// 刷新token
export async function refreshToken() {
  return httpClient.post('/auth/refresh');
}

// 修改密码
export async function changePassword(data: ChangePasswordRequest) {
  return httpClient.post<ChangePasswordResponse>('/auth/change-password', data);
} 