// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 此处后端没有提供注释 POST /auth/login */
export async function customApiFunction(
  body: API.Login,
  options?: { [key: string]: any }
) {
  return request<API.LoginResponse>(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/logout */
export async function customApiFunction2(options?: { [key: string]: any }) {
  return request<any>(`/api/auth/logout`, {
    method: "POST",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /auth/verify */
export async function customApiFunction3(options?: { [key: string]: any }) {
  return request<any>(`/api/auth/verify`, {
    method: "GET",
    ...(options || {}),
  });
}
