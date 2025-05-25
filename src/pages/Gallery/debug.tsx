import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, message } from 'antd';
import { API } from '@/services';
import { API_BASE_URL } from '@/config/env';

const { Text, Paragraph } = Typography;

const GalleryDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDebugInfo({
      nodeEnv: process.env.NODE_ENV,
      apiBaseUrl: API_BASE_URL,
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, []);

  const testPublicAPI = async () => {
    setLoading(true);
    console.log('🔍 开始测试公开照片API...');
    
    try {
      console.log('📡 发送请求到:', '/api/public/photos');
      
      const response = await API.Public.getPublicPhotoList({
        per_page: 5,
        page: 1
      });
      
      console.log('✅ API响应成功:', response);
      
      if (response.success && response.data) {
        setPhotos(response.data.photos);
        message.success(`成功获取 ${response.data.photos.length} 张照片`);
      } else {
        message.error('API调用成功但响应格式异常');
        console.error('❌ 响应格式异常:', response);
      }
    } catch (error) {
      console.error('❌ API调用失败:', error);
      message.error('API调用失败: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    console.log('🔍 测试直接Fetch请求...');
    
    try {
      const url = '/api/public/photos?per_page=5&page=1';
      console.log('📡 发送直接fetch到:', url);
      
      const response = await fetch(url);
      console.log('📨 Fetch响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Fetch响应数据:', data);
      
      if (data.success && data.data) {
        setPhotos(data.data.photos);
        message.success(`直接Fetch成功获取 ${data.data.photos.length} 张照片`);
      } else {
        message.error('直接Fetch成功但响应格式异常');
      }
    } catch (error) {
      console.error('❌ 直接Fetch失败:', error);
      message.error('直接Fetch失败: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="Gallery API 调试信息" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div><Text strong>环境:</Text> {debugInfo.nodeEnv}</div>
          <div><Text strong>API Base URL:</Text> {debugInfo.apiBaseUrl}</div>
          <div><Text strong>当前页面:</Text> {debugInfo.currentUrl}</div>
          <div><Text strong>时间戳:</Text> {debugInfo.timestamp}</div>
        </Space>
      </Card>

      <Card title="API 测试" style={{ marginBottom: '24px' }}>
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={testPublicAPI}
            loading={loading}
          >
            测试公开照片API
          </Button>
          <Button 
            onClick={testDirectFetch}
            loading={loading}
          >
            测试直接Fetch
          </Button>
        </Space>
      </Card>

      {photos.length > 0 && (
        <Card title="照片数据" style={{ marginBottom: '24px' }}>
          <Paragraph>
            <Text strong>照片数量:</Text> {photos.length}
          </Paragraph>
          {photos.map((photo, index) => (
            <Card key={photo.id || index} size="small" style={{ marginBottom: '8px' }}>
              <Space direction="vertical" size="small">
                <div><Text strong>ID:</Text> {photo.id}</div>
                <div><Text strong>标题:</Text> {photo.title}</div>
                <div><Text strong>公开:</Text> {photo.is_public ? '是' : '否'}</div>
                <div><Text strong>缩略图:</Text> {photo.thumbnail}</div>
              </Space>
            </Card>
          ))}
        </Card>
      )}

      <Card title="调试提示">
        <Paragraph>
          1. 打开浏览器开发者工具的Network面板查看网络请求
        </Paragraph>
        <Paragraph>
          2. 查看Console面板的详细日志输出
        </Paragraph>
        <Paragraph>
          3. 确认后端服务在 http://localhost:9000 正常运行
        </Paragraph>
        <Paragraph>
          4. 检查代理配置是否正确转发请求
        </Paragraph>
      </Card>
    </div>
  );
};

export default GalleryDebug; 