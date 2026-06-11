import { NavLink } from "react-router-dom";

const navigationItems = [
  { to: "/admin/products", label: "제품 관리", description: "제품 등록과 수정" },
  { to: "/admin/categories", label: "카테고리 관리", description: "제품 분류와 노출 순서" }
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-eyebrow">ECOGOD ADMIN</span>
        <strong>제품관리 시스템</strong>
        <p>큰 글씨와 단순한 흐름으로 제품 정보를 관리합니다.</p>
      </div>

      <nav className="admin-nav" aria-label="관리자 메뉴">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "is-active" : ""}`
            }
          >
            <span className="admin-nav-label">{item.label}</span>
            <span className="admin-nav-description">{item.description}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
