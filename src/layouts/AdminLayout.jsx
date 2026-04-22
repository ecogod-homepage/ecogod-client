import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content-shell">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-eyebrow">관리자 전용 페이지</p>
            <h1 className="admin-topbar-title">제품 정보 관리</h1>
            <p className="admin-topbar-subtitle">
              {admin ? `${admin.name} 관리자님으로 로그인 중` : "로그인된 관리자만 접근할 수 있습니다."}
            </p>
          </div>

          <div className="admin-topbar-actions">
            <Link to="/products" className="btn btn-outline admin-btn-lg">
              공개 제품 페이지 보기
            </Link>
            <button type="button" className="btn btn-primary admin-btn-lg" onClick={logout}>
              로그아웃
            </button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
