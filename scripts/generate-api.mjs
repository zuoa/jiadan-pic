import { generateApi } from 'swagger-typescript-api';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保输出目录存在
const outputDir = path.resolve(process.cwd(), 'src/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateApiCode() {
  try {
    console.log('🚀 开始生成API代码...');
    
    // 从本地OpenAPI规范文件生成
    const localSpecPath = path.resolve(process.cwd(), 'api-spec.json');
    
    // 检查是否存在本地规范文件，如果不存在则从远程获取
    let input;
    if (fs.existsSync(localSpecPath)) {
      console.log('📄 使用本地OpenAPI规范文件');
      input = localSpecPath;
    } else {
      console.log('🌐 从远程服务器获取OpenAPI规范');
      input = 'http://localhost:9000/api/swagger.json';
    }

    const { files } = await generateApi({
      name: 'api.ts',
      input: input,
      output: outputDir,
      generateClient: true,
      generateRouteTypes: true,
      extractRequestParams: true,
      extractRequestBody: true,
      extractResponseError: true,
      extractResponseSuccess: true,
      modular: false,
      silent: false,
      defaultResponseAsSuccess: false,
      generateUnionEnums: true,
      toJS: false,
      enumNamesAsValues: false,
      moduleNameFirstTag: false,
      generateResponseTypes: true,
      sortTypes: true,
      sortRoutes: true,
      cleanOutput: true,
      httpClientType: 'axios',
      unwrapResponseData: false,
      singleHttpClient: true,
    });

    console.log('✅ API代码生成成功！');
    console.log('📁 生成的文件:', files.map(f => f.name).join(', '));
    console.log('📂 输出目录:', outputDir);
    
    // 创建索引文件
    const indexContent = `// 自动生成的API代码
export * from './Api';

// 导出主要的API实例
import { Api, HttpClient } from './Api';

// 创建API实例
const httpClient = new HttpClient({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:9000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiClient = new Api(httpClient);

// 导出类型
export type * from './Api';
`;
    
    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
    console.log('📄 创建索引文件成功');
    
  } catch (error) {
    console.error('❌ 生成API代码失败:', error.message);
    
    // 如果远程获取失败，创建一个基础的模板
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
      console.log('⚠️  无法连接到后端服务，创建基础模板...');
      await createBasicTemplate();
    } else {
      throw error;
    }
  }
}

async function createBasicTemplate() {
  const basicApiContent = `// 基础API模板 - 当OpenAPI规范不可用时使用
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  src: string;
  thumbnail: string;
  date: string;
  size: string;
  location: string;
  is_public: boolean;
  file_name: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface PhotosData {
  photos: Photo[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}

export class Api {
  private http: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.http = axios.create(config);
  }

  // 认证相关
  auth = {
    login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
      this.http.post('/auth/login', data),
    
    logout: (): Promise<AxiosResponse<ApiResponse>> =>
      this.http.post('/auth/logout'),
    
    verify: (): Promise<AxiosResponse<ApiResponse>> =>
      this.http.get('/auth/verify'),
  };

  // 照片相关（需要认证）
  photos = {
    getList: (params?: any): Promise<AxiosResponse<ApiResponse<PhotosData>>> =>
      this.http.get('/photos', { params }),
    
    getDetail: (id: string): Promise<AxiosResponse<ApiResponse<Photo>>> =>
      this.http.get(\`/photos/\${id}\`),
    
    upload: (file: FormData): Promise<AxiosResponse<ApiResponse>> =>
      this.http.post('/photos/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    
    update: (id: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
      this.http.put(\`/photos/\${id}\`, data),
    
    delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
      this.http.delete(\`/photos/\${id}\`),
  };

  // 公开照片
  public = {
    photos: {
      getList: (params?: any): Promise<AxiosResponse<ApiResponse<PhotosData>>> =>
        this.http.get('/public/photos', { params }),
      
      getDetail: (id: string): Promise<AxiosResponse<ApiResponse<Photo>>> =>
        this.http.get(\`/public/photos/\${id}\`),
    }
  };

  // 仪表板
  dashboard = {
    getStats: (): Promise<AxiosResponse<ApiResponse<any>>> =>
      this.http.get('/dashboard/stats'),
  };
}
`;

  fs.writeFileSync(path.join(outputDir, 'api.ts'), basicApiContent);
  console.log('📄 创建基础API模板成功');
  
  // 创建索引文件
  const indexContent = `// 自动生成的API代码
export * from './Api';

// 导出主要的API实例
import { Api, HttpClient } from './Api';

// 创建API实例
const httpClient = new HttpClient({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:9000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiClient = new Api(httpClient);

// 导出类型
export type * from './Api';
`;
  
  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
  console.log('📄 创建索引文件成功');
}

// 运行生成
generateApiCode().catch(console.error); 