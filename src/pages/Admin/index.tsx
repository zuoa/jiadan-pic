import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Popconfirm,
  Image,
  DatePicker,
  Typography,
  Row,
  Col,
  Statistic,
  Layout,
  Dropdown,
  Switch,
  Tag,
  Collapse,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  PictureOutlined,
  CalendarOutlined,
  FileImageOutlined,
  LogoutOutlined,
  UserOutlined,
  EnvironmentOutlined,
  EyeInvisibleOutlined,
  InboxOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LockOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AdminAuth } from '../../utils/auth';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import './index.less';
import '../../styles/layout.less';

const { Title } = Typography;
const { TextArea } = Input;
const { Content } = Layout;
const { Dragger } = Upload;
const { Panel } = Collapse;

interface Photo {
  id: string;
  title: string;
  description: string;
  src: string;
  thumbnail: string;
  date: string;
  size?: string;
  location?: string;
  isPublic: boolean;
}

const Admin: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 获取当前用户信息
  const currentUser = AdminAuth.getCurrentUser();

  // 用户菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user',
      icon: <UserOutlined />,
      label: `欢迎，${currentUser}`,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 退出登录处理
  function handleLogout() {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出管理系统吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        AdminAuth.logout();
        message.success('已成功退出登录');
        // 刷新页面以触发登录检查
        window.location.reload();
      },
    });
  }

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setPhotos([
        {
          id: '1',
          title: 'Beautiful Landscape',
          description: 'Captured at a breathtaking location',
          src: 'https://picsum.photos/800/600?random=1',
          thumbnail: 'https://picsum.photos/300/200?random=1',
          date: '2024-01-15',
          size: '2.1 MB',
          location: '黄山风景区',
          isPublic: true,
        },
        {
          id: '2',
          title: 'City Night View',
          description: 'The charm of city lights at night',
          src: 'https://picsum.photos/800/600?random=2',
          thumbnail: 'https://picsum.photos/300/200?random=2',
          date: '2024-02-20',
          size: '3.5 MB',
          location: '上海外滩',
          isPublic: false,
        },
        {
          id: '3',
          title: 'Nature\'s Beauty',
          description: 'The magnificence of natural wonders',
          src: 'https://picsum.photos/800/600?random=3',
          thumbnail: 'https://picsum.photos/300/200?random=3',
          date: '2024-03-10',
          size: '1.8 MB',
          location: '张家界国家森林公园',
          isPublic: true,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const columns: ColumnsType<Photo> = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (thumbnail: string) => (
        <Image
          width={60}
          height={40}
          src={thumbnail}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => location ? (
        <span>
          <EnvironmentOutlined style={{ marginRight: 4, color: '#1890ff' }} />
          {location}
        </span>
      ) : '-',
    },
    {
      title: 'Status',
      dataIndex: 'isPublic',
      key: 'isPublic',
      render: (isPublic: boolean) => (
        <Tag color={isPublic ? 'green' : 'orange'} icon={isPublic ? <EyeOutlined /> : <EyeInvisibleOutlined />}>
          {isPublic ? '公开' : '私有'}
        </Tag>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'File Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Actions',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            Preview
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this photo?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingPhoto(null);
    setFileList([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    form.setFieldsValue({
      ...photo,
      date: dayjs(photo.date),
    });
    setFileList([]);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
    message.success('Successfully deleted');
  };

  const handlePreview = (photo: Photo) => {
    Modal.info({
      title: photo.title,
      width: '80%',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Image src={photo.src} style={{ maxWidth: '100%' }} />
          <p style={{ marginTop: 16, color: '#666' }}>{photo.description}</p>
        </div>
      ),
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const photo: Photo = {
        id: editingPhoto?.id || Date.now().toString(),
        title: values.title || '未命名照片',
        description: values.description || '',
        src: values.src || 'https://picsum.photos/800/600?random=' + Math.random(),
        thumbnail: values.thumbnail || 'https://picsum.photos/300/200?random=' + Math.random(),
        date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        size: '2.0 MB',
        location: values.location || '',
        isPublic: values.isPublic !== undefined ? values.isPublic : false,
      };

      if (editingPhoto) {
        setPhotos(photos.map((p) => (p.id === photo.id ? photo : p)));
        message.success('Successfully updated');
      } else {
        setPhotos([photo, ...photos]);
        message.success('Successfully added');
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return false; // Prevent automatic upload
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const totalPhotos = photos.length;
  const totalSize = photos.reduce((acc, photo) => {
    const size = parseFloat(photo.size?.replace(' MB', '') || '0');
    return acc + size;
  }, 0);

  return (
    <Layout className="basic-layout">
      <Content className="content">
        <div className="admin-container">
                <div className="admin-header">
        <div className="admin-title">
          <h1>Dashboard</h1>
          <p>Manage your photo collection</p>
        </div>
        <div className="admin-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Photo
          </Button>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />}>
              {currentUser}
            </Button>
          </Dropdown>
        </div>
      </div>

      <Row gutter={16} className="admin-stats">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Photos"
              value={totalPhotos}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Storage"
              value={totalSize.toFixed(1)}
              suffix="MB"
              prefix={<FileImageOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="This Month"
              value={photos.filter(p => dayjs(p.date).isAfter(dayjs().startOf('month'))).length}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="admin-table">
        <Table
          columns={columns}
          dataSource={photos}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} photos`,
          }}
        />
      </Card>

      <Modal
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText="Confirm"
        cancelText="Cancel"
        closable={true}
        styles={{
          header: {
            backgroundColor: '#fff',
            borderBottom: '1px solid #f0f0f0'
          }
        }}
        closeIcon={
          <span style={{ color: '#000', fontSize: '20px', fontWeight: 'bold' }}>×</span>
        }
        okButtonProps={{ 
          style: { 
            backgroundColor: '#000', 
            borderColor: '#000',
            color: '#fff'
          } 
        }}
      >
        <Form form={form} layout="vertical" initialValues={{ isPublic: false }}>
          {/* 图片上传区域 - 放在最上方 */}
          <Form.Item label="Upload Photo" required style={{ marginBottom: 24 }}>
            <Dragger {...uploadProps} style={{ padding: '40px 20px' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: '48px', color: '#000' }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint" style={{ fontSize: '14px', color: '#666' }}>
                Support for jpg, png formats. File size should not exceed 2MB.
              </p>
            </Dragger>
          </Form.Item>

          {/* 隐私设置区域 - 紧跟上传区域 */}
          <div style={{ marginBottom: 24 }}>
            <Form.Item
              name="isPublic"
              label="Visibility Setting"
              valuePropName="checked"
            >
              <div style={{ 
                padding: '12px 16px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                backgroundColor: '#fafafa'
              }}>
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space>
                      <LockOutlined style={{ color: '#000', fontSize: '16px' }} />
                      <div>
                        <div style={{ fontWeight: 500 }}>Make this photo public</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Turn on to allow others to view this photo
                        </div>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Switch 
                      checkedChildren={<GlobalOutlined />}
                      unCheckedChildren={<LockOutlined />}
                      defaultChecked={false}
                      size="default"
                      style={{
                        backgroundColor: '#000'
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </Form.Item>
          </div>

          {/* 详细信息区域 - 可折叠 */}
          <Collapse 
            style={{ marginBottom: 16 }}
            expandIcon={({ isActive }) => <SettingOutlined rotate={isActive ? 90 : 0} />}
          >
            <Panel 
              header={
                <span style={{ color: '#000', fontWeight: 500 }}>
                  Additional Information (Optional)
                </span>
              } 
              key="1"
            >
              {/* 基本信息 */}
              <div style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="title"
                      label="Photo Title"
                    >
                      <Input 
                        placeholder="Enter a descriptive title for your photo" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="description"
                      label="Description"
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="Tell the story behind this photo..." 
                        style={{ fontSize: '14px' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* 详细信息 */}
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="location"
                      label="Location"
                    >
                      <Input 
                        placeholder="Where was this taken?" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="date"
                      label="Capture Date"
                    >
                      <DatePicker 
                        style={{ width: '100%' }} 
                        placeholder="When was this taken?"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
        </div>
      </Content>
    </Layout>
  );
};

// 用受保护的路由包装Admin页面
const ProtectedAdmin: React.FC = () => {
  return (
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  );
};

export default ProtectedAdmin; 