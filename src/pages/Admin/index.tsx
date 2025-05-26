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
  KeyOutlined,
} from '@ant-design/icons';
import ProtectedRoute from '../../components/ProtectedRoute';
import ChangePassword from '../../components/ChangePassword';
import { AdminAuth } from '../../utils/auth';
import { getPhotos, deletePhoto, updatePhoto, uploadPhoto, togglePhotoVisibility } from '@/services/photos';
import { getStats } from '@/services/dashboard';
import { Photo as ApiPhoto, DashboardStats } from '@/types/api';
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  // 获取当前用户信息
  const currentUser = AdminAuth.getCurrentUsername() || 'Admin';

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
      key: 'changePassword',
      icon: <KeyOutlined />,
      label: '修改密码',
      onClick: () => setChangePasswordVisible(true),
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

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 并行加载照片列表和统计数据
      const [photosResponse, statsResponse] = await Promise.all([
        getPhotos({ per_page: 50, page: 1 }),
        getStats()
      ]);

      if (photosResponse.success && photosResponse.data) {
        // 转换API数据格式为组件需要的格式
        const transformedPhotos: Photo[] = photosResponse.data.photos.map((photo: ApiPhoto) => ({
          id: photo.id,
          title: photo.title,
          description: photo.description,
          src: photo.src,
          thumbnail: photo.thumbnail,
          date: photo.date,
          size: photo.size,
          location: photo.location,
          isPublic: photo.is_public,
        }));
        setPhotos(transformedPhotos);
      }

      if (statsResponse.success) {
        setStats(statsResponse);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('加载数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Photo> = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (thumbnail: string) => (
        <Image
          width={60}
          height={60}
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
      render: (isPublic: boolean, record: Photo) => (
        <Space>
          <Tag color={isPublic ? 'green' : 'orange'} icon={isPublic ? <EyeOutlined /> : <EyeInvisibleOutlined />}>
            {isPublic ? '公开' : '私有'}
          </Tag>
          <Switch
            size="small"
            checked={isPublic}
            onChange={(checked) => handleToggleVisibility(record.id, checked)}
            checkedChildren={<EyeOutlined />}
            unCheckedChildren={<EyeInvisibleOutlined />}
          />
        </Space>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
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
    // 为新照片设置默认值
    form.setFieldsValue({ isPublic: false });
    setModalVisible(true);
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    form.setFieldsValue({
      ...photo,
      isPublic: photo.isPublic, // 确保公开状态字段正确设置
      date: dayjs(photo.date),
    });
    setFileList([]);
    setModalVisible(true);
    console.log('📝 编辑照片，设置表单值:', {
      ...photo,
      isPublic: photo.isPublic,
      date: dayjs(photo.date),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePhoto(id);
      setPhotos(photos.filter((photo) => photo.id !== id));
      message.success('照片删除成功');
      // 重新加载统计数据
      loadData();
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('删除失败，请稍后重试');
    }
  };

  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    try {
      console.log(`🔄 切换照片 ${id} 的公开状态为: ${isPublic}`);
      await togglePhotoVisibility(id, isPublic);
      
      // 更新本地状态
      setPhotos(photos.map(photo => 
        photo.id === id ? { ...photo, isPublic } : photo
      ));
      message.success(`照片已${isPublic ? '公开' : '设为私有'}`);
      
      // 重新加载统计数据
      loadData();
    } catch (error: any) {
      console.error('Toggle visibility failed:', error);
      
      // 提供更详细的错误信息
      let errorMessage = '状态切换失败';
      if (error?.status === 404) {
        errorMessage = '照片不存在或API路由未找到';
      } else if (error?.status === 500) {
        errorMessage = '服务器内部错误，请检查后端服务';
      } else if (error?.message) {
        errorMessage = `切换失败: ${error.message}`;
      }
      
      message.error(errorMessage);
      
      // 如果API调用失败，恢复开关状态
      // 这里不需要手动恢复，因为状态没有被更新
    }
  };

  const handlePreview = (photo: Photo) => {
    Modal.info({
      title: photo.title,
      width: '90%',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Image 
            src={photo.src} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '70vh',
              objectFit: 'contain'
            }} 
            preview={{
              src: photo.src, // 确保预览时显示原图
            }}
          />
          {photo.description && (
            <p style={{ marginTop: 16, color: '#666', fontSize: '14px' }}>
              {photo.description}
            </p>
          )}
          {photo.location && (
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {photo.location}
            </p>
          )}
        </div>
      ),
      okText: '关闭',
      centered: true,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('📋 表单验证通过，获取到的值:', values);
      
      if (editingPhoto) {
        // 编辑现有照片
        const updateData = {
          title: values.title || editingPhoto.title,
          description: values.description || editingPhoto.description,
          date: values.date ? values.date.format('YYYY-MM-DD') : editingPhoto.date,
          location: values.location || editingPhoto.location,
          is_public: typeof values.isPublic === 'boolean' ? values.isPublic : editingPhoto.isPublic,
        };

        console.log('📝 编辑照片，准备更新数据:', {
          photoId: editingPhoto.id,
          formValues: values,
          updateData,
          originalPhoto: editingPhoto,
          isPublicCheck: {
            'values.isPublic': values.isPublic,
            'values.isPublic !== undefined': values.isPublic !== undefined,
            'editingPhoto.isPublic': editingPhoto.isPublic,
            'final is_public': updateData.is_public,
            'typeof final is_public': typeof updateData.is_public
          }
        });

        await updatePhoto(editingPhoto.id, updateData);
        message.success('照片信息更新成功');
      } else {
        // 上传新照片
        if (fileList.length === 0) {
          message.error('请选择要上传的照片');
          return;
        }

        const file = fileList[0];
        console.log('📁 准备上传文件:', {
          file,
          originFileObj: file.originFileObj,
          name: file.name,
          size: file.size,
          type: file.type
        });

        // 获取实际的文件对象
        const actualFile = file.originFileObj as File;
        if (!actualFile || !(actualFile instanceof File)) {
          message.error('文件对象无效，请重新选择文件');
          return;
        }

        console.log('📄 实际文件对象:', {
          actualFile,
          name: actualFile.name,
          type: actualFile.type,
          size: actualFile.size
        });

        const formData = new FormData();
        formData.append('file', actualFile, actualFile.name);
        formData.append('title', values.title || '未命名照片');
        formData.append('description', values.description || '');
        formData.append('date', values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
        formData.append('location', values.location || '');
        formData.append('is_public', String(typeof values.isPublic === 'boolean' ? values.isPublic : false));

        // 调试FormData内容
        console.log('📤 FormData内容:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }

        await uploadPhoto(formData);
        message.success('照片上传成功');
      }

      // 重新加载数据
      await loadData();
      setModalVisible(false);
      setFileList([]);
      form.resetFields();
    } catch (error) {
      console.error('Submit failed:', error);
      message.error(editingPhoto ? '更新失败，请稍后重试' : '上传失败，请稍后重试');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      console.log('📁 beforeUpload 检查文件:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });

      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过10MB！');
        return false;
      }
      
      console.log('✅ 文件验证通过，添加到文件列表');
      // 返回false阻止自动上传，但允许文件添加到fileList
      return false;
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      console.log('📋 fileList 更新:', newFileList);
      setFileList(newFileList);
    },
    onDrop(e) {
      console.log('🎯 拖拽文件:', e.dataTransfer.files);
    },
    onRemove: () => {
      console.log('🗑️ 移除文件');
      setFileList([]);
    },
    customRequest: ({ file, onSuccess, onError }) => {
      // 阻止默认上传行为，我们手动处理上传
      console.log('🚫 阻止默认上传，使用手动上传');
      // 立即标记为成功，因为我们会在表单提交时手动上传
      onSuccess?.({}, file);
    },
  };

  // 格式化文件大小的函数
  const formatFileSize = (bytes: number): { value: string; unit: string } => {
    if (bytes === 0) return { value: '0', unit: 'B' };
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    const value = (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1);
    return { value, unit: sizes[i] };
  };

  // 统计数据
  const totalPhotos = stats?.data?.total_photos || photos.length;
  const publicPhotos = stats?.data?.public_photos || photos.filter(p => p.isPublic).length;
  const privatePhotos = stats?.data?.private_photos || photos.filter(p => !p.isPublic).length;
  
  // 计算总大小（字节）
  let totalSizeBytes = 0;
  if (stats?.data?.total_size) {
    // 如果API返回格式化的大小字符串，尝试解析
    const sizeStr = stats.data.total_size;
    if (sizeStr.includes('MB')) {
      totalSizeBytes = parseFloat(sizeStr.replace(' MB', '')) * 1024 * 1024;
    } else if (sizeStr.includes('KB')) {
      totalSizeBytes = parseFloat(sizeStr.replace(' KB', '')) * 1024;
    } else if (sizeStr.includes('GB')) {
      totalSizeBytes = parseFloat(sizeStr.replace(' GB', '')) * 1024 * 1024 * 1024;
    } else if (sizeStr.includes('B') && !sizeStr.includes('KB') && !sizeStr.includes('MB') && !sizeStr.includes('GB')) {
      totalSizeBytes = parseFloat(sizeStr.replace(' B', ''));
    } else {
      // 如果是纯数字，假设是字节
      const numValue = parseFloat(sizeStr);
      if (!isNaN(numValue)) {
        totalSizeBytes = numValue;
      }
    }
  } else {
    // 从本地照片数据计算
    totalSizeBytes = photos.reduce((acc, photo) => {
      if (photo.size) {
        let sizeInBytes = 0;
        if (photo.size.includes('MB')) {
          sizeInBytes = parseFloat(photo.size.replace(' MB', '')) * 1024 * 1024;
        } else if (photo.size.includes('KB')) {
          sizeInBytes = parseFloat(photo.size.replace(' KB', '')) * 1024;
        } else if (photo.size.includes('GB')) {
          sizeInBytes = parseFloat(photo.size.replace(' GB', '')) * 1024 * 1024 * 1024;
        } else if (photo.size.includes('B') && !photo.size.includes('KB') && !photo.size.includes('MB') && !photo.size.includes('GB')) {
          sizeInBytes = parseFloat(photo.size.replace(' B', ''));
        } else {
          // 如果是纯数字，假设是字节
          const numValue = parseFloat(photo.size);
          if (!isNaN(numValue)) {
            sizeInBytes = numValue;
          }
        }
        return acc + sizeInBytes;
      }
      return acc;
    }, 0);
  }
  
  const formattedSize = formatFileSize(totalSizeBytes);

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
              value={formattedSize.value}
              suffix={formattedSize.unit}
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
        <Form form={form} layout="vertical">
          {/* 图片上传区域 - 放在最上方 */}
          {!editingPhoto && (
            <Form.Item label="Upload Photo" required style={{ marginBottom: 24 }}>
              <Dragger {...uploadProps} style={{ padding: '40px 20px' }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: '48px', color: '#000' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                  点击或拖拽文件到此区域上传
                </p>
                <p className="ant-upload-hint" style={{ fontSize: '14px', color: '#666' }}>
                  支持 JPG、PNG 格式，文件大小不超过 10MB
                </p>
              </Dragger>
            </Form.Item>
          )}

          {/* 隐私设置区域 - 紧跟上传区域 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Visibility Setting</div>
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
                  <Form.Item name="isPublic" valuePropName="checked" noStyle>
                    <Switch 
                      checkedChildren={<GlobalOutlined />}
                      unCheckedChildren={<LockOutlined />}
                      size="default"
                      style={{
                        backgroundColor: '#000'
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
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

      {/* 修改密码模态框 */}
      <ChangePassword
        visible={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        onSuccess={() => {
          message.success('密码修改成功，请重新登录');
          // 延迟一下再退出登录，让用户看到成功消息
          setTimeout(() => {
            AdminAuth.logout();
            window.location.reload();
          }, 1500);
        }}
      />
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