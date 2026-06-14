import { request } from "./http";

export async function submitInquiry(payload) {
  return request("/api/v1/inquiries", { method: "POST", body: payload });
}
