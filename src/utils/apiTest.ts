// 注释掉旧的API导入，等待OpenAPI生成新的API
// import { API } from '@/services/api';
import { AdminAuth } from './auth';
import { getPhotos, getPublicPhotos } from '@/services/photos';
import { getStats } from '@/services/dashboard';

/**
 * API测试工具
 */
export class ApiTester {
  /**
   * 测试API连接
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 测试API连接...');
      const response = await getPublicPhotos({ per_page: 1, page: 1 });
      console.log('✅ API连接测试成功:', response);
      return response.success;
    } catch (error) {
      console.error('❌ API连接测试失败:', error);
      return false;
    }
  }

  /**
   * 测试认证功能
   */
  static async testAuth(username: string, password: string): Promise<boolean> {
    try {
      console.log('🔐 测试认证功能...');
      const success = await AdminAuth.login(username, password);
      if (success) {
        console.log('✅ 登录测试成功');
        // 测试token验证
        const isValid = await AdminAuth.validateToken();
        console.log('🔍 Token验证结果:', isValid);
        return isValid;
      } else {
        console.log('❌ 登录测试失败');
        return false;
      }
    } catch (error) {
      console.error('❌ 认证测试异常:', error);
      return false;
    }
  }

  /**
   * 测试照片API
   */
  static async testPhotoAPI(): Promise<boolean> {
    try {
      console.log('📸 测试照片API...');
      
      // 需要先登录
      if (!AdminAuth.isAuthenticated()) {
        console.log('⚠️ 请先登录后再测试照片API');
        return false;
      }

      // 测试获取照片列表
      const photosResponse = await getPhotos({ per_page: 5, page: 1 });
      console.log('📋 照片列表API测试:', photosResponse);

      // 测试获取统计数据
      const statsResponse = await getStats();
      console.log('📊 统计数据API测试:', statsResponse);

      return photosResponse.success && statsResponse.success;
    } catch (error) {
      console.error('❌ 照片API测试失败:', error);
      return false;
    }
  }

  /**
   * 测试上传功能（需要用户手动选择文件）
   */
  static async testUpload(): Promise<void> {
    try {
      console.log('📤 测试上传功能...');
      
      if (!AdminAuth.isAuthenticated()) {
        console.log('⚠️ 请先登录后再测试上传功能');
        return;
      }

      // 创建文件输入元素
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          console.log('❌ 未选择文件');
          return;
        }

        console.log('📁 选择的文件:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          isFile: file instanceof File
        });

        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('title', '测试上传照片');
        formData.append('description', '这是一张测试上传的照片');
        formData.append('date', new Date().toISOString().split('T')[0]);
        formData.append('location', '测试地点');
        formData.append('is_public', 'false');

        console.log('📤 FormData内容:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }

        try {
          const { uploadPhoto } = await import('@/services/photos');
          const response = await uploadPhoto(formData);
          console.log('✅ 上传测试成功:', response);
        } catch (error) {
          console.error('❌ 上传测试失败:', error);
          if (error instanceof Error) {
            console.error('错误详情:', {
              message: error.message,
              stack: error.stack
            });
          }
        }
      };

      input.click();
      console.log('📂 请选择要上传的图片文件...');
    } catch (error) {
      console.error('❌ 上传测试初始化失败:', error);
    }
  }

  /**
   * 测试仪表板API
   */
  static async testDashboardAPI(): Promise<boolean> {
    try {
      console.log('📊 测试仪表板API...');
      
      if (!AdminAuth.isAuthenticated()) {
        console.log('⚠️ 请先登录后再测试仪表板API');
        return false;
      }

      const response = await getStats();
      console.log('✅ 仪表板API测试成功:', response);
      return response.success;
    } catch (error) {
      console.error('❌ 仪表板API测试失败:', error);
      return false;
    }
  }

  /**
   * 运行所有测试
   */
  static async runAllTests(credentials?: { username: string; password: string }): Promise<void> {
    console.log('🚀 开始运行API测试套件...');
    console.log('='.repeat(50));

    // 1. 测试API连接
    console.log('1️⃣ 测试API连接');
    const connectionResult = await this.testConnection();
    console.log(`结果: ${connectionResult ? '✅ 通过' : '❌ 失败'}`);
    console.log('-'.repeat(30));

    // 2. 测试认证功能（如果提供了凭据）
    if (credentials) {
      console.log('2️⃣ 测试认证功能');
      const authResult = await this.testAuth(credentials.username, credentials.password);
      console.log(`结果: ${authResult ? '✅ 通过' : '❌ 失败'}`);
      console.log('-'.repeat(30));

      // 3. 测试照片API（需要认证）
      if (authResult) {
        console.log('3️⃣ 测试照片API');
        const photoResult = await this.testPhotoAPI();
        console.log(`结果: ${photoResult ? '✅ 通过' : '❌ 失败'}`);
        console.log('-'.repeat(30));

        console.log('4️⃣ 测试仪表板API');
        const dashboardResult = await this.testDashboardAPI();
        console.log(`结果: ${dashboardResult ? '✅ 通过' : '❌ 失败'}`);
        console.log('-'.repeat(30));
      }
    } else {
      console.log('⚠️ 未提供认证凭据，跳过需要认证的测试');
    }

    console.log('='.repeat(50));
    console.log('🏁 API测试套件运行完成');
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
        testDashboardAPI: this.testDashboardAPI,
        testUpload: this.testUpload,
        runAllTests: this.runAllTests,
      };
      console.log('🔧 API测试工具已挂载到 window.apiTester');
      console.log('使用方法:');
      console.log('  window.apiTester.testConnection() - 测试API连接');
      console.log('  window.apiTester.runAllTests({username: "admin", password: "password"}) - 运行所有测试');
      console.log('  window.apiTester.testAuth("admin", "password") - 测试认证');
      console.log('  window.apiTester.testPhotoAPI() - 测试照片API（需要先登录）');
      console.log('  window.apiTester.testDashboardAPI() - 测试仪表板API（需要先登录）');
      console.log('  window.apiTester.testUpload() - 测试上传功能（需要先登录）');
    }
  }
} 