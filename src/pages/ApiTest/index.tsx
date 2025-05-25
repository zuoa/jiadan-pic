import React, { useState } from 'react';
import { Button, Card, Typography, Space, Divider, Alert, message, Spin, Tag } from 'antd';
import { API, ApiInfo } from '@/services';
import { AdminAuth } from '@/utils/auth';
import { ApiTester } from '@/utils/apiTest';
import type { Photo } from '@/types/api';

const { Title, Text, Paragraph } = Typography;

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [publicPhotos, setPublicPhotos] = useState<Photo[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const addResult = (test: string, success: boolean, data?: any, error?: any) => {
    const result = {
      test,
      success,
      data,
      error: error?.message || error,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testBasicFetch = async () => {
    setLoading(true);
    try {
      console.log('开始测试基础fetch请求...');
      const response = await fetch('/api/public/photos?per_page=1&page=1');
      console.log('Fetch响应状态:', response.status);
      console.log('Fetch响应头:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetch响应数据:', data);
        addResult('基础Fetch请求', true, data);
      } else {
        addResult('基础Fetch请求', false, null, `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch请求错误:', error);
      addResult('基础Fetch请求', false, null, error);
    }
    setLoading(false);
  };

  const testApiClient = async () => {
    setLoading(true);
    try {
      console.log('开始测试API客户端...');
      const response = await API.Public.getPublicPhotoList({ per_page: 1, page: 1 });
      console.log('API客户端响应:', response);
      addResult('API客户端请求', true, response);
    } catch (error) {
      console.error('API客户端错误:', error);
      addResult('API客户端请求', false, null, error);
    }
    setLoading(false);
  };

  const testApiTester = async () => {
    setLoading(true);
    try {
      console.log('开始测试API连接工具...');
      const success = await ApiTester.testConnection();
      addResult('API连接测试', success, success ? '连接成功' : '连接失败');
    } catch (error) {
      console.error('API连接测试错误:', error);
      addResult('API连接测试', false, null, error);
    }
    setLoading(false);
  };

  const testDirectBackend = async () => {
    setLoading(true);
    try {
      console.log('开始测试直连后端...');
      const response = await fetch('http://localhost:9000/api/public/photos?per_page=1&page=1');
      console.log('直连后端响应状态:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('直连后端响应数据:', data);
        addResult('直连后端请求', true, data);
      } else {
        addResult('直连后端请求', false, null, `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('直连后端错误:', error);
      addResult('直连后端请求', false, null, error);
    }
    setLoading(false);
  };

  const testPublicPhotos = async () => {
    setLoading(true);
    try {
      const response = await API.Public.getPublicPhotoList({
        per_page: 10,
        page: 1
      });
      
      if (response.success && response.data) {
        setPublicPhotos(response.data.photos);
        message.success(`成功获取 ${response.data.photos.length} 张公开照片`);
      } else {
        message.error('获取公开照片失败：' + (response.message || '未知错误'));
      }
    } catch (error) {
      console.error('API调用失败:', error);
      message.error('API调用失败，请检查后端服务是否运行');
    } finally {
      setLoading(false);
    }
  };

  const testAllPhotos = async () => {
    setLoading(true);
    try {
      const response = await API.Photo.getPhotoList({
        per_page: 10,
        page: 1
      });
      
      if (response.success && response.data) {
        setAllPhotos(response.data.photos);
        message.success(`成功获取 ${response.data.photos.length} 张照片（需要认证）`);
      } else {
        message.error('获取照片失败：' + (response.message || '未知错误'));
      }
    } catch (error) {
      console.error('API调用失败:', error);
      message.error('API调用失败，请检查认证状态和后端服务');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await API.Auth.login({
        username: 'admin',
        password: 'jiadan2024admin'
      });
      
      if (response.success) {
        message.success('登录成功！');
      } else {
        message.error('登录失败：' + (response.message || '未知错误'));
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查后端服务');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>API测试调试页面</Title>
      
      <Alert
        message="调试说明"
        description={
          <div>
            <p>这个页面用于测试API请求是否正常工作。请按顺序进行测试，并查看浏览器开发者工具的Network面板。</p>
            <div style={{ marginTop: 8 }}>
              <Text strong>当前API模式：</Text>
              <Tag color={ApiInfo.isUsingGenerated ? 'green' : 'blue'} style={{ marginLeft: 8 }}>
                {ApiInfo.mode.toUpperCase()}
              </Tag>
              {ApiInfo.isUsingGenerated && (
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  (使用自动生成的API代码)
                </Text>
              )}
            </div>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card title="测试操作" style={{ marginBottom: 24 }}>
        <Space wrap>
          <Button 
            type="primary" 
            onClick={testBasicFetch}
            loading={loading}
          >
            1. 测试基础Fetch (代理)
          </Button>
          
          <Button 
            onClick={testApiClient}
            loading={loading}
          >
            2. 测试API客户端
          </Button>
          
          <Button 
            onClick={testApiTester}
            loading={loading}
          >
            3. 测试API连接工具
          </Button>
          
          <Button 
            onClick={testDirectBackend}
            loading={loading}
          >
            4. 测试直连后端
          </Button>
          
          <Button onClick={testLogin} loading={loading}>
            5. 测试登录
          </Button>
          
          <Button onClick={testPublicPhotos} loading={loading}>
            6. 获取公开照片
          </Button>
          
          <Button onClick={testAllPhotos} loading={loading}>
            7. 获取所有照片（需认证）
          </Button>
          
          <Button onClick={clearResults} disabled={loading}>
            清除结果
          </Button>
        </Space>
      </Card>

      <Card title="环境信息">
        <Paragraph>
          <Text strong>当前环境:</Text> {process.env.NODE_ENV}
        </Paragraph>
        <Paragraph>
          <Text strong>API基础URL:</Text> {process.env.NODE_ENV === 'development' ? '/api (使用代理)' : 'http://localhost:9000/api'}
        </Paragraph>
        <Paragraph>
          <Text strong>当前页面URL:</Text> {window.location.href}
        </Paragraph>
      </Card>

      {testResults.length > 0 && (
        <Card title="测试结果" style={{ marginTop: 24 }}>
          {testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <Space align="start">
                <Text type={result.success ? 'success' : 'danger'}>
                  {result.success ? '✅' : '❌'} {result.test}
                </Text>
                <Text type="secondary">{result.timestamp}</Text>
              </Space>
              
              {result.data && (
                <div style={{ marginTop: 8, marginLeft: 24 }}>
                  <Text strong>响应数据:</Text>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: 8, 
                    borderRadius: 4,
                    fontSize: 12,
                    overflow: 'auto',
                    maxHeight: 200
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.error && (
                <div style={{ marginTop: 8, marginLeft: 24 }}>
                  <Text type="danger" strong>错误信息:</Text>
                  <pre style={{ 
                    background: '#fff2f0', 
                    padding: 8, 
                    borderRadius: 4,
                    fontSize: 12,
                    color: '#a8071a'
                  }}>
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </div>
              )}
              
              {index < testResults.length - 1 && <Divider />}
            </div>
          ))}
        </Card>
      )}

      <Card title="调试建议" style={{ marginTop: 24 }}>
        <Paragraph>
          <Text strong>1. 检查网络面板:</Text> 打开浏览器开发者工具 → Network面板，查看请求是否发送
        </Paragraph>
        <Paragraph>
          <Text strong>2. 检查控制台:</Text> 查看是否有JavaScript错误或警告
        </Paragraph>
        <Paragraph>
          <Text strong>3. 检查代理日志:</Text> 在终端查看是否有代理转发日志
        </Paragraph>
        <Paragraph>
          <Text strong>4. 检查后端服务:</Text> 确认 http://localhost:9000 是否正常运行
        </Paragraph>
      </Card>

      {/* 照片API测试结果 */}
      {publicPhotos.length > 0 && (
        <Card title="公开照片结果" style={{ marginTop: 24 }}>
          <Spin spinning={loading}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {publicPhotos.map((photo) => (
                <div key={photo.id} style={{ 
                  padding: '8px', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <Text strong>ID:</Text> {photo.id} | 
                  <Text strong> 标题:</Text> {photo.title} | 
                  <Text strong> 公开:</Text> {photo.is_public ? '是' : '否'} |
                  <Text strong> 位置:</Text> {photo.location || '无'}
                </div>
              ))}
            </Space>
          </Spin>
        </Card>
      )}

      {allPhotos.length > 0 && (
        <Card title="所有照片结果（需认证）" style={{ marginTop: 24 }}>
          <Spin spinning={loading}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {allPhotos.map((photo) => (
                <div key={photo.id} style={{ 
                  padding: '8px', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <Text strong>ID:</Text> {photo.id} | 
                  <Text strong> 标题:</Text> {photo.title} | 
                  <Text strong> 公开:</Text> {photo.is_public ? '是' : '否'} |
                  <Text strong> 位置:</Text> {photo.location || '无'}
                </div>
              ))}
            </Space>
          </Spin>
        </Card>
      )}
    </div>
  );
} 