import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Button, Card, Space, Typography, Alert } from 'antd';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    // 3秒后显示导航选项，而不是自动跳转
    const timer = setTimeout(() => {
      setShowNavigation(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (path: string) => {
    history.push(path);
  };

  if (!showNavigation) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #f8f8f8 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #1890ff',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
            正在加载照片管理系统...
          </p>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #f8f8f8 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
            🖼️ 贾丹照片管理系统
          </Title>
          
          <Alert
            message="系统功能导航"
            description="请选择要访问的功能模块。如果您遇到API连接问题，建议先访问API测试页面进行调试。"
            type="info"
            showIcon
            style={{ marginBottom: 30 }}
          />

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="📸 用户功能" size="small">
              <Space wrap>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigateTo('/gallery')}
                >
                  📷 查看相册
                </Button>
                <Button 
                  size="large"
                  onClick={() => navigateTo('/admin')}
                >
                  🔐 管理后台
                </Button>
              </Space>
            </Card>

            <Card title="🔧 开发工具" size="small">
              <Paragraph>
                <strong>API测试页面：</strong>用于测试和调试API连接问题
              </Paragraph>
              <Button 
                type="dashed" 
                size="large"
                onClick={() => navigateTo('/api-test')}
                style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}
              >
                🧪 API连接测试
              </Button>
            </Card>

            <Card title="📖 开发文档" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Paragraph>
                  <strong>API集成说明：</strong> 查看 <code>API_INTEGRATION.md</code> 文件
                </Paragraph>
                <Paragraph>
                  <strong>代理配置说明：</strong> 查看 <code>PROXY_CONFIG.md</code> 文件
                </Paragraph>
                <Paragraph>
                  <strong>调试指南：</strong> 查看 <code>DEBUG_GUIDE.md</code> 文件
                </Paragraph>
              </Space>
            </Card>
          </Space>

          <Alert
            message="💡 提示"
            description="如果API请求没有发送，请访问API测试页面进行调试。确保后端服务运行在 http://localhost:9000"
            type="warning"
            showIcon
            style={{ marginTop: 30 }}
          />
        </Card>
      </div>
    </div>
  );
}
