// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 此处后端没有提供注释 GET /dashboard/stats */
export async function customApiFunction(options?: { [key: string]: any }) {
  return request<API.DashboardStats>(`/api/dashboard/stats`, {
    method: "GET",
    ...(options || {}),
  });
}
