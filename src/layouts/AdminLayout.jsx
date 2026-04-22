import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content-shell">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-eyebrow">관리자 전용 페이지</p>
            <h1 className="admin-topbar-title">제품 정보 관리</h1>
          </div>

          <div className="admin-topbar-actions">
            <Link to="/products" className="btn btn-outline admin-btn-lg">
              공개 제품 페이지 보기
            </Link>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
