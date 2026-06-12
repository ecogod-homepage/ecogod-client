import { useDeferredValue, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { fetchAdminNotices } from "../../services/api/notices.js";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export default function AdminNoticesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [bannerMessage] = useState(location.state?.message ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    let ignore = false;

    fetchAdminNotices()
      .then((items) => {
        if (!ignore) {
          setNotices(items);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message ?? "공지 목록을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const keyword = deferredSearchTerm.trim().toLowerCase();
  const filteredNotices = notices.filter((item) => {
    const matchKeyword =
      keyword.length === 0 ||
      item.title.toLowerCase().includes(keyword) ||
      (item.summary || "").toLowerCase().includes(keyword);
    const matchPublished =
      publishedFilter === "all" ||
      (publishedFilter === "published" ? item.published : !item.published);

    return matchKeyword && matchPublished;
  });

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">공지 관리</p>
          <h2 className="heading-2 admin-page-title">공지사항을 정리하세요</h2>
        </div>
        <Link to="/admin/notices/new" className="btn btn-primary admin-btn-lg">
          새 공지 등록
        </Link>
      </header>

      {bannerMessage ? <div className="admin-banner success">{bannerMessage}</div> : null}
      {errorMessage ? <div className="admin-banner error">{errorMessage}</div> : null}

      <section className="admin-panel">
        <div className="admin-filter-grid">
          <label className="admin-control">
            <span className="admin-control-label">제목 검색</span>
            <input
              className="admin-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="admin-control">
            <span className="admin-control-label">게시 상태</span>
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
        </div>

        {isLoading ? (
          <div className="admin-loading">공지 목록을 불러오는 중입니다.</div>
        ) : filteredNotices.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>요약</th>
                  <th>게시 상태</th>
                  <th>게시일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.map((notice) => (
                  <tr key={notice.id}>
                    <td className="admin-table-title-cell">{notice.title}</td>
                    <td>{notice.summary || "요약 없음"}</td>
                    <td>
                      <AdminStatusBadge tone={notice.published ? "success" : "muted"}>
                        {notice.published ? "공개" : "비공개"}
                      </AdminStatusBadge>
                    </td>
                    <td>{formatDate(notice.publishedAt || notice.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline admin-table-action"
                        onClick={() => navigate(`/admin/notices/${notice.id}/edit`)}
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
            title="조건에 맞는 공지가 없습니다"
            message="새 공지를 등록해 주세요."
            actionText="새 공지 등록"
            onAction={() => navigate("/admin/notices/new")}
          />
        )}
      </section>
    </section>
  );
}
