declare namespace API {
  type ChangePassword = {
    /** 当前密码 */
    current_password: string;
    /** 新密码 */
    new_password: string;
    /** 确认新密码 */
    confirm_password: string;
  };

  type ChangePasswordResponse = {
    /** 请求是否成功 */
    success?: boolean;
    /** 响应消息 */
    message?: string;
  };

  type customApiFunctionParams = {
    photo_id: string;
  };

  type customApiFunctionParams = {
    photo_id: string;
  };

  type customApiFunctionParams = {
    /** 搜索关键词 */
    search?: string;
    /** 每页数量 */
    per_page?: number;
    /** 页码 */
    page?: number;
  };

  type customApiFunctionParams = {
    photo_id: string;
  };

  type customApiFunctionParams = {
    photo_id: string;
  };

  type customApiFunctionParams = {
    photo_id: string;
  };

  type customApiFunctionParams = {
    /** 每页数量 */
    per_page?: number;
    /** 页码 */
    page?: number;
  };

  type customApiFunctionParams = {
    photo_id: string;
  };

  type DashboardStats = {
    /** 请求是否成功 */
    success?: boolean;
    data?: StatsData;
  };

  type Error = {
    /** 请求是否成功 */
    success?: boolean;
    error?: ErrorDetail;
  };

  type ErrorDetail = {
    /** 错误代码 */
    code?: string;
    /** 错误消息 */
    message?: string;
    /** 错误详情 */
    details?: string;
  };

  type Login = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type LoginData = {
    /** JWT认证令牌 */
    token?: string;
    user?: User;
  };

  type LoginResponse = {
    /** 请求是否成功 */
    success?: boolean;
    /** 响应消息 */
    message?: string;
    data?: LoginData;
  };

  type Pagination = {
    /** 当前页码 */
    page?: number;
    /** 每页数量 */
    per_page?: number;
    /** 总数量 */
    total?: number;
    /** 总页数 */
    pages?: number;
  };

  type Photo = {
    /** 照片ID */
    id?: string;
    /** 照片标题 */
    title?: string;
    /** 照片描述 */
    description?: string;
    /** 照片URL */
    src?: string;
    /** 缩略图URL */
    thumbnail?: string;
    /** 拍摄日期 */
    date?: string;
    /** 文件大小（字节） */
    size?: number;
    /** 拍摄地点 */
    location?: string;
    /** 是否公开 */
    is_public?: boolean;
    /** 文件名 */
    file_name?: string;
    /** 文件类型 */
    mime_type?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
  };

  type PhotosData = {
    photos?: Photo[];
    pagination?: Pagination;
  };

  type PhotosResponse = {
    /** 请求是否成功 */
    success?: boolean;
    /** 响应消息 */
    message?: string;
    data?: PhotosData;
  };

  type PhotoUpdate = {
    /** 照片标题 */
    title?: string;
    /** 照片描述 */
    description?: string;
    /** 拍摄日期 */
    date?: string;
    /** 拍摄地点 */
    location?: string;
    /** 是否公开 */
    is_public?: boolean;
  };

  type StatsData = {
    /** 总照片数 */
    total_photos?: number;
    /** 公开照片数 */
    public_photos?: number;
    /** 私有照片数 */
    private_photos?: number;
    /** 总文件大小 */
    total_size?: string;
    /** 最近上传的照片 */
    recent_uploads?: Photo[];
  };

  type User = {
    /** 用户ID */
    id?: number;
    /** 用户名 */
    username?: string;
    /** 邮箱 */
    email?: string;
  };

  type ViewKeyVerify = {
    /** 查看密钥 */
    password: string;
  };
}
