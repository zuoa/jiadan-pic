import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, KeyOutlined } from '@ant-design/icons';
import { changePassword } from '@/services/auth';
import { ChangePasswordRequest } from '@/types/api';
import './index.less';

interface ChangePasswordProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ChangePasswordRequest) => {
    if (values.new_password !== values.confirm_password) {
      message.error('新密码和确认密码不一致');
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(values);
      
      if (response.success) {
        message.success('密码修改成功！');
        form.resetFields();
        onCancel();
        onSuccess?.();
      } else {
        message.error(response.message || '密码修改失败');
      }
    } catch (error: any) {
      console.error('修改密码失败:', error);
      message.error(error.message || '密码修改失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KeyOutlined style={{ color: '#1890ff' }} />
          <span>修改密码</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={480}
      destroyOnClose
      className="change-password-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="current_password"
          label="当前密码"
          rules={[
            { required: true, message: '请输入当前密码' },
            { min: 6, message: '密码至少6个字符' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入当前密码"
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6个字符' },
            { max: 50, message: '密码不能超过50个字符' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
              message: '密码必须包含字母和数字'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码（至少6位，包含字母和数字）"
            size="large"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="确认新密码"
          dependencies={['new_password']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码"
            size="large"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} size="large">
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ minWidth: 100 }}
            >
              {loading ? '修改中...' : '确认修改'}
            </Button>
          </div>
        </Form.Item>
      </Form>

      <div className="password-tips">
        <div className="tips-title">密码安全提示：</div>
        <ul>
          <li>密码长度至少6个字符</li>
          <li>必须包含字母和数字</li>
          <li>建议使用大小写字母、数字和特殊字符的组合</li>
          <li>不要使用容易被猜到的密码</li>
        </ul>
      </div>
    </Modal>
  );
};

export default ChangePassword; 