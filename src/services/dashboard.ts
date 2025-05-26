import { httpClient } from '@/utils/request';
import { DashboardStats } from '@/types/api';

// 获取仪表板统计数据
export async function getStats() {
  return httpClient.get<DashboardStats>('/dashboard/stats');
}

// 获取最近活动
export async function getRecentActivity() {
  return httpClient.get('/dashboard/activity');
}

// 获取存储使用情况
export async function getStorageUsage() {
  return httpClient.get('/dashboard/storage');
} 