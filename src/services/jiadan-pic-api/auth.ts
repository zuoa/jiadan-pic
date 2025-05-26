// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 此处后端没有提供注释 POST /auth/change-password */
export async function customApiFunction(
  body: API.ChangePassword,
  options?: { [key: string]: any }
) {
  return request<API.ChangePasswordResponse>(`/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/login */
export async function customApiFunction2(
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
export async function customApiFunction3(options?: { [key: string]: any }) {
  return request<any>(`/api/auth/logout`, {
    method: "POST",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /auth/verify */
export async function customApiFunction4(
  body: API.ViewKeyVerify,
  options?: { [key: string]: any }
) {
  return request<any>(`/api/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
