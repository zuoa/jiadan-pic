// Umi 应用运行时配置
import { ApiTester } from '@/utils/apiTest';
// 引入极简主义设计系统
import './styles/minimalist.less';

// 应用初始化
export function render(oldRender: () => void) {
  // 开发环境下暴露API测试工具到控制台
  if (process.env.NODE_ENV === 'development') {
    ApiTester.exposeToWindow();
    
    console.log('🚀 照片管理系统已启动');
    console.log('📡 API测试工具已就绪，请在控制台使用：');
    console.log('   window.apiTester.testConnection() - 测试API连接');
    console.log('   window.apiTester.runAllTests({username: "admin", password: "your-password"}) - 运行所有测试');
    console.log('');
    console.log('📖 更多使用说明请查看: API_INTEGRATION.md');
  }
  
  oldRender();
} 