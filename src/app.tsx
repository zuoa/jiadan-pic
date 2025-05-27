// Umi 应用运行时配置
// 引入极简主义设计系统
import './styles/minimalist.less';

// 应用初始化
export function render(oldRender: () => void) {
  console.log('🚀 照片管理系统已启动');
  oldRender();
} 