import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/company", label: "회사소개" },
  { to: "/products", label: "제품 및 서비스" },
  { to: "/inquiry", label: "견적 문의" },
  { to: "/notices", label: "공지사항" }
];

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const scriptId = "organization-jsonld";
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ECO GOD Co.,Ltd.",
      url: "https://ecogodfront.vercel.app",
      description: "산업용 필터 설계·제조 전문 기업"
    });
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand" aria-label="ECO GOD 홈으로 이동">
            ECO GOD
          </NavLink>
          <button
            type="button"
            className="menu-toggle"
            aria-label="메뉴 열기"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`global-nav ${mobileMenuOpen ? "is-open" : ""}`}
            aria-label="메인 메뉴"
          >
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} ECO GOD. All rights reserved.</p>
          <p>산업용 필터 설계·제조 전문</p>
        </div>
      </footer>
    </div>
  );
}
