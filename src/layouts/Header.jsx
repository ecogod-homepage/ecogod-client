import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import brandLogo from "../assets/ecogod-logo-request.png";

const navLinks = [
  { name: "회사소개", path: "/company" },
  { name: "제품 및 서비스", path: "/products" },
  { name: "견적 문의", path: "/inquiry" },
  { name: "공지사항", path: "/notices" }
];

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="ECOGOD 홈으로 이동">
          <span className="brand-logo-surface">
            <img src={brandLogo} alt="ECOGOD 로고" className="brand-logo" />
          </span>
          <span className="sr-only">ECOGOD</span>
        </Link>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          aria-controls="global-navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="global-navigation"
          className={`global-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="메인 메뉴"
        >
          <ul>
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                location.pathname.startsWith(`${link.path}/`);

              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
