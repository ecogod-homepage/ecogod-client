import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const initialForm = {
  loginId: "",
  password: ""
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, status } = useAdminAuth();
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === "loading") {
    return (
      <section className="admin-auth-shell">
        <div className="admin-auth-card admin-auth-status-card">
          <p className="admin-auth-status-label">권한 확인 중</p>
          <h1>로그인 상태를 확인하고 있습니다.</h1>
          <p>저장된 로그인 정보가 있으면 자동으로 관리자 화면으로 이동합니다.</p>
        </div>
      </section>
    );
  }

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || "/admin/products";
    return <Navigate to={destination} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login({
        loginId: form.loginId.trim(),
        password: form.password
      });

      const destination = location.state?.from?.pathname || "/admin/products";
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "로그인에 실패했습니다. 입력 정보를 다시 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-auth-shell">
      <div className="admin-auth-card">
        <div className="admin-auth-brand">
          <p className="admin-auth-eyebrow">ECOGAD ADMIN</p>
          <h1>관리자 로그인</h1>
          <p>
            제품 등록과 카테고리 관리는 로그인한 관리자만 사용할 수 있습니다.
            로그인 후 관리자 전용 화면으로 이동합니다.
          </p>
        </div>

        <form className="admin-auth-form" onSubmit={handleSubmit}>
          <label className="admin-auth-field">
            <span>로그인 ID</span>
            <input
              type="text"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              placeholder="관리자 로그인 ID를 입력하세요"
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-auth-field">
            <span>비밀번호</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? <p className="admin-auth-error">{errorMessage}</p> : null}

          <button type="submit" className="btn btn-primary admin-auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </section>
  );
}
