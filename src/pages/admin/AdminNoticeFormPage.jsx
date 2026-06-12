import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import {
  fetchAdminNoticeById,
  removeAdminNotice,
  saveAdminNotice
} from "../../services/api/notices.js";

const EMPTY_FORM = {
  title: "",
  summary: "",
  content: "",
  published: false
};

export default function AdminNoticeFormPage() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [bannerMessage] = useState(location.state?.message ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(noticeId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isEditMode = Boolean(noticeId);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    fetchAdminNoticeById(noticeId)
      .then((notice) =>
        setFormValues({
          title: notice.title,
          summary: notice.summary || "",
          content: notice.content || "",
          published: notice.published
        })
      )
      .catch((error) => setErrorMessage(error.message ?? "공지 정보를 불러오지 못했습니다."))
      .finally(() => setIsLoading(false));
  }, [isEditMode, noticeId]);

  async function persistNotice(nextPublished) {
    try {
      setIsSubmitting(true);
      const saved = await saveAdminNotice({ ...formValues, published: nextPublished }, noticeId);

      if (isEditMode) {
        setFormValues({
          title: saved.title,
          summary: saved.summary || "",
          content: saved.content || "",
          published: saved.published
        });
      } else {
        navigate(`/admin/notices/${saved.id}/edit`, {
          replace: true,
          state: { message: "새 공지를 등록했습니다." }
        });
      }
    } catch (error) {
      setErrorMessage(error.message ?? "공지 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true);
      await removeAdminNotice(noticeId);
      navigate("/admin/notices", {
        replace: true,
        state: { message: "공지를 삭제했습니다." }
      });
    } catch (error) {
      setErrorMessage(error.message ?? "공지 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  }

  if (isLoading) {
    return <section className="admin-page admin-loading">공지 정보를 불러오는 중입니다.</section>;
  }

  return (
    <section className="admin-page admin-form-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">{isEditMode ? "공지 수정" : "공지 등록"}</p>
          <h2 className="heading-2 admin-page-title">공지 내용을 입력하세요</h2>
        </div>
        <Link to="/admin/notices" className="btn btn-outline admin-btn-lg">
          목록으로 돌아가기
        </Link>
      </header>

      {bannerMessage ? <div className="admin-banner success">{bannerMessage}</div> : null}
      {errorMessage ? <div className="admin-banner error">{errorMessage}</div> : null}

      <div className="admin-form-layout">
        <section className="admin-panel admin-form-panel">
          <div className="admin-form-grid">
            <label className="admin-control">
              <span className="admin-control-label">공지 제목</span>
              <input
                className="admin-input"
                value={formValues.title}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </label>

            <label className="admin-control">
              <span className="admin-control-label">요약</span>
              <input
                className="admin-input"
                value={formValues.summary}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, summary: event.target.value }))
                }
              />
            </label>

            <label className="admin-control">
              <span className="admin-control-label">본문</span>
              <textarea
                className="admin-input admin-textarea"
                value={formValues.content}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, content: event.target.value }))
                }
              />
            </label>

            <label className="admin-control">
              <span className="admin-control-label">공개 상태</span>
              <select
                className="admin-input admin-select"
                value={String(formValues.published)}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, published: event.target.value === "true" }))
                }
              >
                <option value="true">공개</option>
                <option value="false">비공개</option>
              </select>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="btn btn-primary admin-btn-lg"
              onClick={() => persistNotice(formValues.published)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>

            {isEditMode ? (
              <button
                type="button"
                className="btn admin-btn-danger admin-btn-lg"
                onClick={() => setShowDeleteDialog(true)}
              >
                삭제
              </button>
            ) : null}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="공지를 삭제할까요?"
        message="삭제 후 복구할 수 없습니다."
        confirmText="삭제"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </section>
  );
}
