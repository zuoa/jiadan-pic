import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.less';

const { Title, Paragraph } = Typography;

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const success = await onLogin(values.username, values.password);
      if (success) {
        message.success('登录成功！');
        form.resetFields();
      } else {
        message.error('用户名或密码错误，请重试');
      }
    } catch (error) {
      message.error('登录失败，请稍后重试');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <UserOutlined className="login-icon" />
            <Title level={2} className="login-title">
              管理员登录
            </Title>
            <Paragraph className="login-description">
              请输入管理员凭据以访问后台管理系统
            </Paragraph>
          </div>

          <Form
            form={form}
            name="adminLogin"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button"
                block
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Paragraph className="login-tip">
              请联系系统管理员获取登录凭据
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login; 