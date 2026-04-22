import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./layouts/Header";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import CompanyPage from "./pages/CompanyPage";
import ProductsPage from "./pages/ProductsPage";
import ProductCategoryPage from "./pages/ProductCategoryPage";
import InquiryPage from "./pages/InquiryPage";
import NoticeListPage from "./pages/NoticeListPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import brandLogo from "./assets/ecogad-logo-request.png";

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <span className="footer-brand-logo-surface">
          <img src={brandLogo} alt="ECOGAD 로고" className="footer-brand-logo" loading="lazy" />
        </span>
        <span className="footer-brand-name">ECOGAD Co.,Ltd.</span>
      </div>
      <div className="footer-grid">
        <div>
          <p>(주)에코가드 | ECO GOD Co.,Ltd.</p>
          <p>대표: 전철환</p>
          <p>주소: 경기도 안산시 단원구 만해로 205 타원TAKRAIII 3층 A-315호</p>
          <p>Tel. 031-380-0329 | Mob. 010-5223-5879</p>
          <p>Fax. 031-437-6360 | E-mail. filter0524@naver.com</p>
        </div>
        <div className="footer-copyright">
          <p>산업용 필터 설계·제조 전문</p>
          <p>[화력발전소/방전가공기/공기정화용/집진기/수처리/유압오일/MIST/COMP]</p>
          <p>Copyright © {new Date().getFullYear()} ECO GOD. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminRoute ? "admin-root-shell" : "site-shell"}>
      {isAdminRoute ? null : <Header />}
      <main className={isAdminRoute ? "admin-root-main" : "site-main"}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/:productId/edit" element={<AdminProductFormPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:categorySlug" element={<ProductCategoryPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/notices" element={<NoticeListPage />} />
          <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {isAdminRoute ? null : <Footer />}
    </div>
  );
}
