import { useDeferredValue, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { fetchAdminCategories } from "../../services/api/adminCategories";
import { fetchAdminProducts } from "../../services/api/adminProducts";

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryCode, setCategoryCode] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [bannerMessage, setBannerMessage] = useState(location.state?.message ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [productItems, categoryItems] = await Promise.all([
          fetchAdminProducts(),
          fetchAdminCategories()
        ]);

        if (!ignore) {
          setProducts(productItems);
          setCategories(categoryItems);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message ?? "제품 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const normalizedKeyword = deferredSearchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((item) => {
    const matchKeyword =
      normalizedKeyword.length === 0 ||
      item.name.toLowerCase().includes(normalizedKeyword) ||
      item.summary.toLowerCase().includes(normalizedKeyword);

    const matchCategory = categoryCode === "all" || item.categoryCode === categoryCode;
    const matchPublished =
      publishedFilter === "all" ||
      (publishedFilter === "published" ? item.published : !item.published);

    return matchKeyword && matchCategory && matchPublished;
  });

  const summary = {
    total: products.length,
    published: products.filter((item) => item.published).length,
    hidden: products.filter((item) => !item.published).length
  };

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">제품 관리</p>
          <h2 className="heading-2 admin-page-title">등록된 제품을 한눈에 확인하세요</h2>
          <p className="body-text admin-page-description">
            검색과 필터를 먼저 배치해 필요한 제품을 빠르게 찾고 바로 수정할 수 있게 구성했습니다.
          </p>
        </div>

        <Link to="/admin/products/new" className="btn btn-primary admin-btn-lg">
          새 제품 등록
        </Link>
      </header>

      {bannerMessage ? <div className="admin-banner success">{bannerMessage}</div> : null}
      {errorMessage ? <div className="admin-banner error">{errorMessage}</div> : null}

      <div className="admin-summary-grid">
        <article className="admin-summary-card">
          <span className="admin-summary-label">전체 제품</span>
          <strong>{summary.total}</strong>
          <p>등록된 제품 수</p>
        </article>
        <article className="admin-summary-card">
          <span className="admin-summary-label">공개 제품</span>
          <strong>{summary.published}</strong>
          <p>홈페이지에 노출되는 제품</p>
        </article>
        <article className="admin-summary-card">
          <span className="admin-summary-label">비공개 제품</span>
          <strong>{summary.hidden}</strong>
          <p>작성 중이거나 검토 중인 제품</p>
        </article>
      </div>

      <section className="admin-panel">
        <div className="admin-filter-grid">
          <label className="admin-control">
            <span className="admin-control-label">제품명 검색</span>
            <input
              type="text"
              className="admin-input"
              placeholder="예: ULPA H13"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="admin-control">
            <span className="admin-control-label">카테고리</span>
            <select
              className="admin-input admin-select"
              value={categoryCode}
              onChange={(event) => setCategoryCode(event.target.value)}
            >
              <option value="all">전체 카테고리</option>
              {categories.map((item) => (
                <option key={item.id} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-control">
            <span className="admin-control-label">공개 상태</span>
            <select
              className="admin-input admin-select"
              value={publishedFilter}
              onChange={(event) => setPublishedFilter(event.target.value)}
            >
              <option value="all">전체</option>
              <option value="published">공개만</option>
              <option value="hidden">비공개만</option>
            </select>
          </label>

          <div className="admin-control admin-control-actions">
            <span className="admin-control-label">검색 초기화</span>
            <button
              type="button"
              className="btn btn-outline admin-btn-lg"
              onClick={() => {
                setSearchTerm("");
                setCategoryCode("all");
                setPublishedFilter("all");
              }}
            >
              필터 초기화
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-loading">제품 목록을 불러오는 중입니다.</div>
        ) : filteredProducts.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th>제품명</th>
                  <th>한줄 요약</th>
                  <th>공개 여부</th>
                  <th>최근 수정일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.categoryName}</td>
                    <td className="admin-table-title-cell">{product.name}</td>
                    <td>{product.summary || "요약 없음"}</td>
                    <td>
                      <AdminStatusBadge tone={product.published ? "success" : "muted"}>
                        {product.published ? "공개" : "비공개"}
                      </AdminStatusBadge>
                    </td>
                    <td>{formatDate(product.updatedAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline admin-table-action"
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 제품이 없습니다"
            message="검색어와 필터를 조정하거나 새 제품을 등록해 주세요."
            actionText="새 제품 등록"
            onAction={() => navigate("/admin/products/new")}
          />
        )}
      </section>
    </section>
  );
}
