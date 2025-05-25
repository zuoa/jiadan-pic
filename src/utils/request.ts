import { BaseResponse } from '@/types/api';
import { API_BASE_URL } from '@/config/env';

// HTTP 错误类型
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 请求配置接口
interface RequestOptions extends RequestInit {
  baseURL?: string;
  timeout?: number;
  params?: Record<string, any>;
}

// HTTP 客户端类
export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = 10000) {
    // 验证 baseURL
    if (!baseURL) {
      throw new Error('API_BASE_URL 未配置或为空，请检查环境配置');
    }
    
    this.baseURL = baseURL;
    this.timeout = timeout;
    
    // 开发环境下输出配置信息
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 HttpClient初始化:', {
        baseURL: this.baseURL,
        timeout: this.timeout,
        API_BASE_URL,
        isRelativeURL: this.baseURL.startsWith('/'),
        currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'N/A (SSR)'
      });
    }
  }

  /**
   * 获取认证token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('admin-auth-token');
  }

  /**
   * 构建请求头
   */
  private buildHeaders(options: RequestOptions = {}): Headers {
    const headers = new Headers(options.headers);
    
    // 设置默认Content-Type
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // 添加认证头
    const token = this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * 构建完整URL
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    try {
      let url: URL;
      
      // 检查 baseURL 是否是相对路径
      if (this.baseURL.startsWith('/')) {
        // 相对路径：直接拼接路径
        const fullPath = this.baseURL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
        
        // 检查是否在浏览器环境中
        if (typeof window === 'undefined') {
          throw new Error('相对路径的 API_BASE_URL 需要在浏览器环境中使用');
        }
        
        url = new URL(fullPath, window.location.origin);
      } else {
        // 绝对路径：使用原有逻辑
        url = new URL(endpoint, this.baseURL);
      }
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      return url.toString();
    } catch (error: any) {
      console.error('❌ URL构建失败:', {
        endpoint,
        baseURL: this.baseURL,
        error: error.message,
        isRelativeURL: this.baseURL.startsWith('/'),
        windowAvailable: typeof window !== 'undefined'
      });
      throw new ApiError(0, 'INVALID_URL', `URL构建失败: ${error.message}`);
    }
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    // 检查是否是JSON响应
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        // 处理API错误响应
        if (data.error) {
          throw new ApiError(
            response.status,
            data.error.code || 'UNKNOWN_ERROR',
            data.error.message || '请求失败',
            data.error.details
          );
        }
        throw new ApiError(response.status, 'HTTP_ERROR', `HTTP ${response.status}`);
      }

      return data;
    }

    // 非JSON响应
    if (!response.ok) {
      throw new ApiError(response.status, 'HTTP_ERROR', `HTTP ${response.status}`);
    }

    return response as any;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { baseURL, timeout, params, ...requestOptions } = options;
    
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(options);

    // 开发环境下输出调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API请求详情:', {
        endpoint,
        url,
        method: requestOptions.method || 'GET',
        params,
        headers: Object.fromEntries(headers.entries()),
        baseURL: this.baseURL
      });
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || this.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        headers,
        signal: controller.signal,
      });

      // 开发环境下输出响应信息
      if (process.env.NODE_ENV === 'development') {
        console.log('📨 API响应详情:', {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // 开发环境下输出错误信息
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API请求失败:', {
          url,
          error: error.message,
          type: error.name,
        });
      }
      
      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new ApiError(0, 'TIMEOUT', '请求超时');
      }

      if (error.name === 'TypeError') {
        throw new ApiError(0, 'NETWORK_ERROR', '网络连接失败');
      }

      throw new ApiError(0, 'UNKNOWN_ERROR', error.message || '未知错误');
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, params?: Record<string, any>, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * 文件上传请求
   */
  async upload<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    // 对于文件上传，不设置Content-Type，让浏览器自动设置
    const { headers, ...restOptions } = options;
    const uploadHeaders = new Headers(headers);
    uploadHeaders.delete('Content-Type');

    return this.request<T>(endpoint, {
      ...restOptions,
      method: 'POST',
      body: formData,
      headers: uploadHeaders,
    });
  }
}

// 导出默认实例
export const httpClient = new HttpClient(); 