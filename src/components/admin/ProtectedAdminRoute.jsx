import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { status, isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <section className="admin-auth-shell">
        <div className="admin-auth-card admin-auth-status-card">
          <p className="admin-auth-status-label">권한 확인 중</p>
          <h1>로그인 상태를 확인하고 있습니다.</h1>
          <p>잠시만 기다리면 관리자 페이지로 이동합니다.</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
