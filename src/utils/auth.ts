// Admin 认证管理
export class AdminAuth {
  private static readonly STORAGE_KEY = 'admin-auth-token';
  private static readonly USERNAME_KEY = 'admin-username';
  private static readonly ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'jiadan2024admin'
  };

  /**
   * 验证管理员登录凭据
   */
  static async validateCredentials(username: string, password: string): Promise<boolean> {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return username === this.ADMIN_CREDENTIALS.username && 
           password === this.ADMIN_CREDENTIALS.password;
  }

  /**
   * 登录并保存认证状态
   */
  static async login(username: string, password: string): Promise<boolean> {
    const isValid = await this.validateCredentials(username, password);
    
    if (isValid) {
      // 生成简单的token（实际项目中应该使用JWT）
      const token = btoa(`${username}:${Date.now()}`);
      localStorage.setItem(this.STORAGE_KEY, token);
      localStorage.setItem(this.USERNAME_KEY, username);
      return true;
    }
    
    return false;
  }

  /**
   * 退出登录
   */
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
  }

  /**
   * 检查是否已登录
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(this.STORAGE_KEY);
    return !!token;
  }

  /**
   * 获取当前登录的用户名
   */
  static getCurrentUser(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
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
  static validateToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // 简单的token验证（实际项目中应该验证JWT的签名和过期时间）
      const decoded = atob(token);
      return decoded.includes(':');
    } catch {
      return false;
    }
  }
} 