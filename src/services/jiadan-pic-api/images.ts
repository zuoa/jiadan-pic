// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 此处后端没有提供注释 GET /images/${param0}/original */
export async function customApiFunction(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams,
  options?: { [key: string]: any }
) {
  const { photo_id: param0, ...queryParams } = params;
  return request<any>(`/api/images/${param0}/original`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /images/${param0}/thumbnail */
export async function customApiFunction2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.customApiFunctionParams,
  options?: { [key: string]: any }
) {
  const { photo_id: param0, ...queryParams } = params;
  return request<any>(`/api/images/${param0}/thumbnail`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}
