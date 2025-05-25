// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 此处后端没有提供注释 GET /public/photos */
export async function customApiFunction(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams,
  options?: { [key: string]: any }
) {
  return request<API.PhotosResponse>(`/api/public/photos`, {
    method: "GET",
    params: {
      // per_page has a default value: 12
      per_page: "12",
      // page has a default value: 1
      page: "1",
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /public/photos/${param0} */
export async function customApiFunction2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams,
  options?: { [key: string]: any }
) {
  const { photo_id: param0, ...queryParams } = params;
  return request<any>(`/api/public/photos/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}
