// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max'

/** 此处后端没有提供注释 GET /photos */
export async function customApiFunction(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams
    ,
  options ?: {[key: string]: any}
) {
  return request<API.PhotosResponse>(`${/api}/photos`, {
  method: 'GET',
    params: {
        
        // per_page has a default value: 12
          'per_page': '12',
        // page has a default value: 1
          'page': '1',...params,},
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /photos/${param0} */
export async function customApiFunction3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams
    ,
  options ?: {[key: string]: any}
) {
  const { 'photo_id': param0, 
  ...queryParams
  } = params;
  return request<any>(`${/api}/photos/${param0}`, {
  method: 'GET',
    params: {...queryParams,},
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /photos/${param0} */
export async function customApiFunction4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams
    ,body: API.PhotoUpdate,
  options ?: {[key: string]: any}
) {
  const { 'photo_id': param0, 
  ...queryParams
  } = params;
  return request<any>(`${/api}/photos/${param0}`, {
  method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {...queryParams,},
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /photos/${param0} */
export async function customApiFunction5(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams
    ,
  options ?: {[key: string]: any}
) {
  const { 'photo_id': param0, 
  ...queryParams
  } = params;
  return request<any>(`${/api}/photos/${param0}`, {
  method: 'DELETE',
    params: {...queryParams,},
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /photos/upload */
export async function customApiFunction2(
  options ?: {[key: string]: any}
) {
  return request<any>(`${/api}/photos/upload`, {
  method: 'POST',
    ...(options || {}),
  });
}

