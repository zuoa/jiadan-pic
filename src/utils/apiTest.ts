// 注释掉旧的API导入，等待OpenAPI生成新的API
// import { API } from '@/services/api';
import { AdminAuth } from './auth';

/**
 * API测试工具
 */
export class ApiTester {
  /**
   * 测试API连接
   */
  static async testConnection(): Promise<boolean> {
    try {
      // TODO: 使用OpenAPI生成的API
      // const response = await API.Public.getPublicPhotoList({ per_page: 1, page: 1 });
      console.log('API连接测试将在OpenAPI生成后可用');
      return false;
    } catch (error) {
      console.error('API连接测试失败:', error);
      return false;
    }
  }

  /**
   * 测试认证功能
   */
  static async testAuth(username: string, password: string): Promise<boolean> {
    try {
      const success = await AdminAuth.login(username, password);
      if (success) {
        console.log('认证测试成功');
        // 测试token验证
        const isValid = await AdminAuth.validateToken();
        console.log('Token验证结果:', isValid);
        return isValid;
      } else {
        console.log('认证测试失败');
        return false;
      }
    } catch (error) {
      console.error('认证测试异常:', error);
      return false;
    }
  }

  /**
   * 测试照片API
   */
  static async testPhotoAPI(): Promise<boolean> {
    try {
      // 需要先登录
      if (!AdminAuth.isAuthenticated()) {
        console.log('请先登录后再测试照片API');
        return false;
      }

      // TODO: 使用OpenAPI生成的API
      // const response = await API.Photo.getPhotoList({ per_page: 5, page: 1 });
      // const stats = await API.Dashboard.getStats();
      console.log('照片API测试将在OpenAPI生成后可用');

      return false;
    } catch (error) {
      console.error('照片API测试失败:', error);
      return false;
    }
  }

  /**
   * 运行所有测试
   */
  static async runAllTests(credentials?: { username: string; password: string }): Promise<void> {
    console.log('开始API测试...');

    // 1. 测试连接
    console.log('\n1. 测试API连接...');
    const connectionOk = await this.testConnection();
    
    if (!connectionOk) {
      console.log('❌ API连接失败，OpenAPI生成后将可用');
      return;
    }
    console.log('✅ API连接正常');

    // 2. 测试认证（如果提供了凭据）
    if (credentials) {
      console.log('\n2. 测试用户认证...');
      const authOk = await this.testAuth(credentials.username, credentials.password);
      
      if (!authOk) {
        console.log('❌ 用户认证失败');
        return;
      }
      console.log('✅ 用户认证成功');

      // 3. 测试照片API
      console.log('\n3. 测试照片API...');
      const photoApiOk = await this.testPhotoAPI();
      
      if (!photoApiOk) {
        console.log('❌ 照片API测试失败');
        return;
      }
      console.log('✅ 照片API测试成功');
    }

    console.log('\n🎉 所有API测试完成！');
  }

  /**
   * 在浏览器控制台中运行测试
   */
  static exposeToWindow(): void {
    if (typeof window !== 'undefined') {
      (window as any).apiTester = {
        testConnection: this.testConnection,
        testAuth: this.testAuth,
        testPhotoAPI: this.testPhotoAPI,
        runAllTests: this.runAllTests,
      };
      console.log('API测试工具已挂载到 window.apiTester');
      console.log('使用方法:');
      console.log('  window.apiTester.testConnection() - 测试API连接');
      console.log('  window.apiTester.runAllTests({username: "admin", password: "password"}) - 运行所有测试');
    }
  }
} 