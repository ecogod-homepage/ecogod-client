import { request } from "./http";

export async function fetchNoticeList() {
  return request("/api/v1/notices");
}

export async function fetchNoticeById(noticeId) {
  return request(`/api/v1/notices/${noticeId}`);
}

export const fetchAdminNotices = () => request("/api/v1/admin/notices", { auth: true });
export const fetchAdminNoticeById = (id) => request(`/api/v1/admin/notices/${id}`, { auth: true });
export const saveAdminNotice = (body, id) => request(id ? `/api/v1/admin/notices/${id}` : "/api/v1/admin/notices", {
  method: id ? "PATCH" : "POST", auth: true, body
});
export const removeAdminNotice = (id) => request(`/api/v1/admin/notices/${id}`, { method: "DELETE", auth: true });
