import { useEffect, useState } from "react";
import AdminStatusBadge from "../../components/admin/AdminStatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  fetchAdminCategories,
  removeAdminCategory,
  saveAdminCategory
} from "../../services/api/adminCategories";

const EMPTY_FORM = {
  code: "",
  slug: "",
  name: "",
  description: "",
  sortOrder: 10,
  isActive: true
};

function validateCategory(values, isEditMode) {
  const errors = {};

  if (!isEditMode && !values.code.trim()) {
    errors.code = "카테고리 코드를 입력해 주세요.";
  }

  if (!isEditMode && !values.slug.trim()) {
    errors.slug = "카테고리 주소(slug)를 입력해 주세요.";
  }

  if (!values.name.trim()) {
    errors.name = "카테고리명을 입력해 주세요.";
  }

  return errors;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerMessage, setBannerMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isEditMode = Boolean(selectedId);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        setIsLoading(true);
        const items = await fetchAdminCategories();

        if (!ignore) {
          setCategories(items);
          if (items.length > 0) {
            const first = items[0];
            setSelectedId(first.id);
            setFormValues({
              code: first.code,
              slug: first.slug,
              name: first.name,
              description: first.description,
              sortOrder: first.sortOrder,
              isActive: first.isActive
            });
          }
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message ?? "카테고리 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  function resetForm() {
    setSelectedId("");
    setFieldErrors({});
    setErrorMessage("");
    setBannerMessage("");
    setFormValues({
      ...EMPTY_FORM,
      sortOrder: categories.length > 0 ? categories[categories.length - 1].sortOrder + 10 : 10
    });
  }

  function selectCategory(category) {
    setSelectedId(category.id);
    setFieldErrors({});
    setErrorMessage("");
    setBannerMessage("");
    setFormValues({
      code: category.code,
      slug: category.slug,
      name: category.name,
      description: category.description,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function reloadCategories(targetId) {
    const items = await fetchAdminCategories();
    setCategories(items);

    if (targetId) {
      const target = items.find((item) => item.id === targetId);
      if (target) {
        selectCategory(target);
      }
    }
  }

  async function handleSave() {
    const validationErrors = validateCategory(formValues, isEditMode);
    setFieldErrors(validationErrors);
    setErrorMessage("");

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage("입력한 내용을 다시 확인해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const saved = await saveAdminCategory(
        {
          ...formValues,
          sortOrder: Number(formValues.sortOrder)
        },
        selectedId || undefined
      );
      await reloadCategories(saved.id);
      setBannerMessage(isEditMode ? "카테고리 정보가 저장되었습니다." : "새 카테고리가 등록되었습니다.");
    } catch (error) {
      setErrorMessage(error.message ?? "카테고리를 저장하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true);
      await removeAdminCategory(selectedId);
      const items = await fetchAdminCategories();
      setCategories(items);
      if (items.length > 0) {
        selectCategory(items[0]);
      } else {
        resetForm();
      }
      setBannerMessage("카테고리가 삭제되었습니다.");
    } catch (error) {
      setErrorMessage(error.message ?? "카테고리를 삭제하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">카테고리 관리</p>
          <h2 className="heading-2 admin-page-title">제품 분류 체계를 쉽게 정리하세요</h2>
          <p className="body-text admin-page-description">
            코드와 주소는 최초 등록 후 유지하고, 이름과 설명, 노출 순서를 주로 관리하는 흐름입니다.
          </p>
        </div>

        <button type="button" className="btn btn-primary admin-btn-lg" onClick={resetForm}>
          새 카테고리 추가
        </button>
      </header>

      {bannerMessage ? <div className="admin-banner success">{bannerMessage}</div> : null}
      {errorMessage ? <div className="admin-banner error">{errorMessage}</div> : null}

      <div className="admin-split-grid">
        <section className="admin-panel">
          {isLoading ? (
            <div className="admin-loading">카테고리 목록을 불러오는 중입니다.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>코드</th>
                    <th>순서</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item) => (
                    <tr
                      key={item.id}
                      className={item.id === selectedId ? "admin-row-selected" : ""}
                      onClick={() => selectCategory(item)}
                    >
                      <td className="admin-table-title-cell">{item.name}</td>
                      <td>{item.code}</td>
                      <td>{item.sortOrder}</td>
                      <td>
                        <AdminStatusBadge tone={item.isActive ? "success" : "muted"}>
                          {item.isActive ? "사용 중" : "사용 안 함"}
                        </AdminStatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="admin-panel admin-editor-panel">
          <h3 className="heading-3">{isEditMode ? "카테고리 수정" : "카테고리 등록"}</h3>

          <div className="admin-form-grid">
            <label className="admin-control">
              <span className="admin-control-label">카테고리 코드</span>
              <input
                type="text"
                name="code"
                className="admin-input"
                value={formValues.code}
                onChange={handleFieldChange}
                disabled={isEditMode}
                placeholder="예: ULPA"
              />
              {fieldErrors.code ? <span className="admin-field-error">{fieldErrors.code}</span> : null}
            </label>

            <label className="admin-control">
              <span className="admin-control-label">주소(slug)</span>
              <input
                type="text"
                name="slug"
                className="admin-input"
                value={formValues.slug}
                onChange={handleFieldChange}
                disabled={isEditMode}
                placeholder="예: ulpa"
              />
              {fieldErrors.slug ? <span className="admin-field-error">{fieldErrors.slug}</span> : null}
            </label>

            <label className="admin-control">
              <span className="admin-control-label">카테고리명</span>
              <input
                type="text"
                name="name"
                className="admin-input"
                value={formValues.name}
                onChange={handleFieldChange}
                placeholder="예: ULPA 필터"
              />
              {fieldErrors.name ? <span className="admin-field-error">{fieldErrors.name}</span> : null}
            </label>

            <label className="admin-control">
              <span className="admin-control-label">설명</span>
              <textarea
                name="description"
                className="admin-input admin-textarea"
                value={formValues.description}
                onChange={handleFieldChange}
                placeholder="공개 제품 페이지 카드에 노출될 설명"
              />
            </label>

            <label className="admin-control">
              <span className="admin-control-label">노출 순서</span>
              <input
                type="number"
                name="sortOrder"
                className="admin-input"
                value={formValues.sortOrder}
                onChange={handleFieldChange}
              />
            </label>

            <fieldset className="admin-control admin-visibility-group">
              <legend className="admin-control-label">사용 여부</legend>
              <div className="admin-segmented">
                <button
                  type="button"
                  className={`admin-segmented-option ${formValues.isActive ? "is-active" : ""}`}
                  onClick={() => setFormValues((prev) => ({ ...prev, isActive: true }))}
                >
                  사용
                </button>
                <button
                  type="button"
                  className={`admin-segmented-option ${!formValues.isActive ? "is-active" : ""}`}
                  onClick={() => setFormValues((prev) => ({ ...prev, isActive: false }))}
                >
                  사용 안 함
                </button>
              </div>
            </fieldset>
          </div>

          <div className="admin-inline-actions">
            <button type="button" className="btn btn-outline admin-btn-lg" onClick={resetForm}>
              새로 작성
            </button>
            <button
              type="button"
              className="btn btn-primary admin-btn-lg"
              disabled={isSubmitting}
              onClick={handleSave}
            >
              저장
            </button>
          </div>

          {isEditMode ? (
            <div className="admin-danger-zone">
              <h4>카테고리 삭제</h4>
              <p className="body-text">이 카테고리를 사용하는 제품이 없을 때만 삭제할 수 있습니다.</p>
              <button
                type="button"
                className="btn admin-btn-danger admin-btn-lg"
                onClick={() => setShowDeleteDialog(true)}
              >
                카테고리 삭제
              </button>
            </div>
          ) : null}
        </aside>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="카테고리를 삭제하시겠습니까?"
        message="연결된 제품이 있으면 삭제되지 않습니다."
        confirmText="삭제하기"
        cancelText="취소"
        destructive
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
