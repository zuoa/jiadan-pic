import { LoginRequest, User, LoginResponse } from '@/types/api';
import { ApiError } from './request';
import * as authAPI from '@/services/auth';

// Admin 认证管理
export class AdminAuth {
  private static readonly STORAGE_KEY = 'admin-auth-token';
  private static readonly USER_KEY = 'admin-user';

  /**
   * 登录并保存认证状态
   */
  static async login(username: string, password: string): Promise<boolean> {
    try {
      const credentials: LoginRequest = { username, password };
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        // 保存token和用户信息
        localStorage.setItem(this.STORAGE_KEY, response.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * 退出登录
   */
  static async logout(): Promise<void> {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // 即使API调用失败，也要清除本地存储
    } finally {
      // 清除本地存储
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * 检查是否已登录
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(this.STORAGE_KEY);
    return !!token;
  }

  /**
   * 获取当前登录的用户信息
   */
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * 获取当前登录的用户名
   */
  static getCurrentUsername(): string | null {
    const user = this.getCurrentUser();
    return user?.username || null;
  }

  /**
   * 获取认证token
   */
  static getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * 验证token是否有效
   */
  static async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      await authAPI.verifyToken();
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      
      // 如果token无效，清除本地存储
      if (error instanceof ApiError && error.status === 401) {
        this.clearAuth();
      }
      
      return false;
    }
  }

  /**
   * 清除认证信息
   */
  private static clearAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * 获取用户友好的错误信息
   */
  static getLoginErrorMessage(error: any): string {
    if (error instanceof ApiError) {
      switch (error.code) {
        case 'INVALID_CREDENTIALS':
          return '用户名或密码错误';
        case 'ACCOUNT_LOCKED':
          return '账户已被锁定';
        case 'ACCOUNT_DISABLED':
          return '账户已被禁用';
        default:
          return error.message || '登录失败';
      }
    }
    
    if (error.code === 'NETWORK_ERROR') {
      return '网络连接失败，请检查网络连接';
    }
    
    if (error.code === 'TIMEOUT') {
      return '请求超时，请重试';
    }
    
    return '登录失败，请稍后重试';
  }
} 