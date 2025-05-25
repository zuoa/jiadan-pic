/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DashboardStats {
  data?: StatsData;
  /**
   * 请求是否成功
   * @example true
   */
  success?: boolean;
}

export type DeletePhotoDetailError = Error;

export interface Error {
  error?: ErrorDetail;
  /**
   * 请求是否成功
   * @example false
   */
  success?: boolean;
}

export interface ErrorDetail {
  /**
   * 错误代码
   * @example "INVALID_CREDENTIALS"
   */
  code?: string;
  /**
   * 错误详情
   * @example "请检查您的登录凭据"
   */
  details?: string;
  /**
   * 错误消息
   * @example "用户名或密码错误"
   */
  message?: string;
}

export type GetPhotoDetailError = Error;

export interface GetPhotoListParams {
  /**
   * 页码
   * @default 1
   */
  page?: number;
  /**
   * 每页数量
   * @default 12
   */
  per_page?: number;
  /** 搜索关键词 */
  search?: string;
}

export type GetPublicPhotoDetailError = Error;

export interface GetPublicPhotoListParams {
  /**
   * 页码
   * @default 1
   */
  page?: number;
  /**
   * 每页数量
   * @default 12
   */
  per_page?: number;
}

export type GetVerifyTokenError = Error;

export interface Login {
  /**
   * 密码
   * @example "password123"
   */
  password: string;
  /**
   * 用户名
   * @example "admin"
   */
  username: string;
}

export interface LoginData {
  /** JWT认证令牌 */
  token?: string;
  user?: User;
}

export interface LoginResponse {
  data?: LoginData;
  /**
   * 响应消息
   * @example "登录成功"
   */
  message?: string;
  /**
   * 请求是否成功
   * @example true
   */
  success?: boolean;
}

export interface Pagination {
  /** 当前页码 */
  page?: number;
  /** 总页数 */
  pages?: number;
  /** 每页数量 */
  per_page?: number;
  /** 总数量 */
  total?: number;
}

export interface Photo {
  /**
   * 创建时间
   * @format date-time
   */
  created_at?: string;
  /** 拍摄日期 */
  date?: string;
  /** 照片描述 */
  description?: string;
  /** 文件名 */
  file_name?: string;
  /** 照片ID */
  id?: string;
  /** 是否公开 */
  is_public?: boolean;
  /** 拍摄地点 */
  location?: string;
  /** 文件类型 */
  mime_type?: string;
  /** 文件大小 */
  size?: string;
  /** 照片URL */
  src?: string;
  /** 缩略图URL */
  thumbnail?: string;
  /** 照片标题 */
  title?: string;
  /**
   * 更新时间
   * @format date-time
   */
  updated_at?: string;
}

export interface PhotoUpdate {
  /** 拍摄日期 */
  date?: string;
  /** 照片描述 */
  description?: string;
  /** 是否公开 */
  is_public?: boolean;
  /** 拍摄地点 */
  location?: string;
  /** 照片标题 */
  title?: string;
}

export interface PhotosData {
  pagination?: Pagination;
  photos?: Photo[];
}

export interface PhotosResponse {
  data?: PhotosData;
  /** 响应消息 */
  message?: string;
  /**
   * 请求是否成功
   * @example true
   */
  success?: boolean;
}

export type PostLoginError = Error;

export type PostPhotoUploadError = Error;

export type PutPhotoDetailError = Error;

export interface StatsData {
  /** 私有照片数 */
  private_photos?: number;
  /** 公开照片数 */
  public_photos?: number;
  /** 最近上传的照片 */
  recent_uploads?: Photo[];
  /** 总照片数 */
  total_photos?: number;
  /** 总文件大小 */
  total_size?: string;
}

export interface User {
  /** 邮箱 */
  email?: string;
  /** 用户ID */
  id?: number;
  /** 用户名 */
  username?: string;
}

export namespace Auth {
  /**
   * No description
   * @tags auth
   * @name GetVerifyToken
   * @request GET:/auth/verify
   * @secure
   */
  export namespace GetVerifyToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name PostLogin
   * @request POST:/auth/login
   */
  export namespace PostLogin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Login;
    export type RequestHeaders = {};
    export type ResponseBody = LoginResponse;
  }

  /**
   * No description
   * @tags auth
   * @name PostLogout
   * @request POST:/auth/logout
   * @secure
   */
  export namespace PostLogout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace Dashboard {
  /**
   * No description
   * @tags dashboard
   * @name GetDashboardStats
   * @request GET:/dashboard/stats
   * @secure
   */
  export namespace GetDashboardStats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardStats;
  }
}

export namespace Photos {
  /**
   * No description
   * @tags photos
   * @name DeletePhotoDetail
   * @request DELETE:/photos/{photo_id}
   * @secure
   */
  export namespace DeletePhotoDetail {
    export type RequestParams = {
      photoId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags photos
   * @name GetPhotoDetail
   * @request GET:/photos/{photo_id}
   * @secure
   */
  export namespace GetPhotoDetail {
    export type RequestParams = {
      photoId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags photos
   * @name GetPhotoList
   * @request GET:/photos
   * @secure
   */
  export namespace GetPhotoList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * 页码
       * @default 1
       */
      page?: number;
      /**
       * 每页数量
       * @default 12
       */
      per_page?: number;
      /** 搜索关键词 */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PhotosResponse;
  }

  /**
   * No description
   * @tags photos
   * @name PostPhotoUpload
   * @request POST:/photos/upload
   * @secure
   */
  export namespace PostPhotoUpload {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags photos
   * @name PutPhotoDetail
   * @request PUT:/photos/{photo_id}
   * @secure
   */
  export namespace PutPhotoDetail {
    export type RequestParams = {
      photoId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PhotoUpdate;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace Public {
  /**
   * No description
   * @tags public
   * @name GetPublicPhotoDetail
   * @request GET:/public/photos/{photo_id}
   */
  export namespace GetPublicPhotoDetail {
    export type RequestParams = {
      photoId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags public
   * @name GetPublicPhotoList
   * @request GET:/public/photos
   */
  export namespace GetPublicPhotoList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * 页码
       * @default 1
       */
      page?: number;
      /**
       * 每页数量
       * @default 12
       */
      per_page?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PhotosResponse;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title 贾丹照片管理 API
 * @version 1.0
 * @baseUrl /api
 *
 * 一个功能完整的照片管理系统API，支持用户认证、照片上传、管理等功能
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name GetVerifyToken
     * @request GET:/auth/verify
     * @secure
     */
    getVerifyToken: (params: RequestParams = {}) =>
      this.http.request<void, GetVerifyTokenError>({
        path: `/auth/verify`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name PostLogin
     * @request POST:/auth/login
     */
    postLogin: (payload: Login, params: RequestParams = {}) =>
      this.http.request<LoginResponse, PostLoginError>({
        path: `/auth/login`,
        method: "POST",
        body: payload,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name PostLogout
     * @request POST:/auth/logout
     * @secure
     */
    postLogout: (params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  dashboard = {
    /**
     * No description
     *
     * @tags dashboard
     * @name GetDashboardStats
     * @request GET:/dashboard/stats
     * @secure
     */
    getDashboardStats: (params: RequestParams = {}) =>
      this.http.request<DashboardStats, any>({
        path: `/dashboard/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  photos = {
    /**
     * No description
     *
     * @tags photos
     * @name DeletePhotoDetail
     * @request DELETE:/photos/{photo_id}
     * @secure
     */
    deletePhotoDetail: (photoId: string, params: RequestParams = {}) =>
      this.http.request<void, DeletePhotoDetailError>({
        path: `/photos/${photoId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags photos
     * @name GetPhotoDetail
     * @request GET:/photos/{photo_id}
     * @secure
     */
    getPhotoDetail: (photoId: string, params: RequestParams = {}) =>
      this.http.request<void, GetPhotoDetailError>({
        path: `/photos/${photoId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags photos
     * @name GetPhotoList
     * @request GET:/photos
     * @secure
     */
    getPhotoList: (query: GetPhotoListParams, params: RequestParams = {}) =>
      this.http.request<PhotosResponse, any>({
        path: `/photos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags photos
     * @name PostPhotoUpload
     * @request POST:/photos/upload
     * @secure
     */
    postPhotoUpload: (params: RequestParams = {}) =>
      this.http.request<void, PostPhotoUploadError>({
        path: `/photos/upload`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags photos
     * @name PutPhotoDetail
     * @request PUT:/photos/{photo_id}
     * @secure
     */
    putPhotoDetail: (
      photoId: string,
      payload: PhotoUpdate,
      params: RequestParams = {},
    ) =>
      this.http.request<void, PutPhotoDetailError>({
        path: `/photos/${photoId}`,
        method: "PUT",
        body: payload,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  public = {
    /**
     * No description
     *
     * @tags public
     * @name GetPublicPhotoDetail
     * @request GET:/public/photos/{photo_id}
     */
    getPublicPhotoDetail: (photoId: string, params: RequestParams = {}) =>
      this.http.request<void, GetPublicPhotoDetailError>({
        path: `/public/photos/${photoId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags public
     * @name GetPublicPhotoList
     * @request GET:/public/photos
     */
    getPublicPhotoList: (
      query: GetPublicPhotoListParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PhotosResponse, any>({
        path: `/public/photos`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
