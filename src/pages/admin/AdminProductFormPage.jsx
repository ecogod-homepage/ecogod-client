import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ProductImageManager from "../../components/admin/ProductImageManager";
import { fetchAdminCategories } from "../../services/api/adminCategories";
import {
  fetchAdminProductById,
  removeAdminProduct,
  saveAdminProduct
} from "../../services/api/adminProducts";

const EMPTY_FORM = {
  categoryCode: "",
  name: "",
  summary: "",
  description: "",
  thumbnailUrl: "",
  detailImages: [],
  published: false
};

function validateForm(values) {
  const errors = {};

  if (!values.categoryCode) {
    errors.categoryCode = "카테고리를 선택해 주세요.";
  }

  if (!values.name.trim()) {
    errors.name = "제품명을 입력해 주세요.";
  }

  if (values.name.trim().length > 150) {
    errors.name = "제품명은 150자 이하여야 합니다.";
  }

  if (values.summary.trim().length > 255) {
    errors.summary = "한줄 요약은 255자 이하여야 합니다.";
  }

  if (values.thumbnailUrl.trim().length > 500) {
    errors.thumbnailUrl = "이미지 주소는 500자 이하여야 합니다.";
  }

  return errors;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function AdminProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerMessage, setBannerMessage] = useState(location.state?.message ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const isEditMode = Boolean(productId);

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

        const categoryItems = await fetchAdminCategories();
        if (ignore) {
          return;
        }

        setCategories(categoryItems);

        if (isEditMode) {
          const product = await fetchAdminProductById(productId);

          if (!product) {
            setErrorMessage("수정할 제품을 찾을 수 없습니다.");
            setIsLoading(false);
            return;
          }

          if (!ignore) {
            setFormValues({
              categoryCode: product.categoryCode,
              name: product.name,
              summary: product.summary,
              description: product.description,
              thumbnailUrl: product.thumbnailUrl,
              detailImages: product.detailImages || [],
              published: product.published
            });
            setCreatedAt(product.createdAt);
            setUpdatedAt(product.updatedAt);
          }
        } else if (categoryItems.length > 0) {
          setFormValues((prev) => ({
            ...prev,
            categoryCode: prev.categoryCode || categoryItems[0].code
          }));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message ?? "화면을 불러오지 못했습니다.");
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
  }, [isEditMode, productId]);

  const selectedCategory =
    categories.find((item) => item.code === formValues.categoryCode) ?? null;

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function persistProduct(nextPublished) {
    const nextValues = { ...formValues, published: nextPublished };
    const validationErrors = validateForm(nextValues);

    setFieldErrors(validationErrors);
    setErrorMessage("");

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage("입력한 내용을 다시 확인해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const saved = await saveAdminProduct(nextValues, productId);

      if (isEditMode) {
        setFormValues((prev) => ({ ...prev, published: saved.published }));
        setUpdatedAt(saved.updatedAt);
        setBannerMessage("제품 정보가 저장되었습니다.");
      } else {
        navigate(`/admin/products/${saved.id}/edit`, {
          replace: true,
          state: { message: "새 제품이 등록되었습니다." }
        });
      }
    } catch (error) {
      setErrorMessage(error.message ?? "저장하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true);
      await removeAdminProduct(productId);
      navigate("/admin/products", {
        replace: true,
        state: { message: "제품이 삭제되었습니다." }
      });
    } catch (error) {
      setErrorMessage(error.message ?? "제품을 삭제하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  }

  if (isLoading) {
    return <section className="admin-page admin-loading">제품 정보를 불러오는 중입니다.</section>;
  }

  if (!isLoading && errorMessage && isEditMode && !formValues.name) {
    return (
      <section className="admin-page">
        <div className="admin-banner error">{errorMessage}</div>
        <Link to="/admin/products" className="btn btn-outline admin-btn-lg">
          제품 목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-page admin-form-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">{isEditMode ? "제품 수정" : "제품 등록"}</p>
          <h2 className="heading-2 admin-page-title">
            {isEditMode ? "제품 정보를 정확하게 수정하세요" : "새 제품 정보를 입력하세요"}
          </h2>
          <p className="body-text admin-page-description">
            필수 항목을 순서대로 배치해 빠뜨리지 않고 입력할 수 있게 구성했습니다.
          </p>
        </div>

        <Link to="/admin/products" className="btn btn-outline admin-btn-lg">
          목록으로 돌아가기
        </Link>
      </header>

      {bannerMessage ? <div className="admin-banner success">{bannerMessage}</div> : null}
      {errorMessage ? <div className="admin-banner error">{errorMessage}</div> : null}

      <div className="admin-form-layout">
        <section className="admin-panel admin-form-panel">
          <div className="admin-form-grid">
            <label className="admin-control">
              <span className="admin-control-label">카테고리</span>
              <select
                name="categoryCode"
                className="admin-input admin-select"
                value={formValues.categoryCode}
                onChange={handleFieldChange}
              >
                <option value="">카테고리를 선택하세요</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryCode ? (
                <span className="admin-field-error">{fieldErrors.categoryCode}</span>
              ) : null}
            </label>

            <label className="admin-control">
              <span className="admin-control-label">제품명</span>
              <input
                type="text"
                name="name"
                className="admin-input"
                value={formValues.name}
                onChange={handleFieldChange}
                placeholder="예: ULPA 고효율 필터 610x610"
              />
              {fieldErrors.name ? <span className="admin-field-error">{fieldErrors.name}</span> : null}
            </label>

            <label className="admin-control">
              <span className="admin-control-label">한줄 요약</span>
              <input
                type="text"
                name="summary"
                className="admin-input"
                value={formValues.summary}
                onChange={handleFieldChange}
                placeholder="홈페이지 카드에서 먼저 보이는 짧은 설명"
              />
              {fieldErrors.summary ? (
                <span className="admin-field-error">{fieldErrors.summary}</span>
              ) : null}
            </label>

            <label className="admin-control">
              <span className="admin-control-label">상세 설명</span>
              <textarea
                name="description"
                className="admin-input admin-textarea"
                value={formValues.description}
                onChange={handleFieldChange}
                placeholder="제품 특징, 사용처, 장점 등을 자세히 적어주세요."
              />
            </label>

            <label className="admin-control">
              <span className="admin-control-label">썸네일 이미지 주소</span>
              <input
                type="text"
                name="thumbnailUrl"
                className="admin-input"
                value={formValues.thumbnailUrl}
                onChange={handleFieldChange}
                placeholder="https:// 형식의 이미지 주소"
              />
              {fieldErrors.thumbnailUrl ? (
                <span className="admin-field-error">{fieldErrors.thumbnailUrl}</span>
              ) : null}
            </label>

            <fieldset className="admin-control admin-visibility-group">
              <legend className="admin-control-label">공개 상태</legend>
              <div className="admin-segmented">
                <button
                  type="button"
                  className={`admin-segmented-option ${formValues.published ? "is-active" : ""}`}
                  onClick={() => setFormValues((prev) => ({ ...prev, published: true }))}
                >
                  공개
                </button>
                <button
                  type="button"
                  className={`admin-segmented-option ${!formValues.published ? "is-active" : ""}`}
                  onClick={() => setFormValues((prev) => ({ ...prev, published: false }))}
                >
                  비공개
                </button>
              </div>
            </fieldset>
          </div>
        </section>

        <ProductImageManager
          thumbnailUrl={formValues.thumbnailUrl}
          onThumbnailChange={(thumbnailUrl) => setFormValues((prev) => ({ ...prev, thumbnailUrl }))}
          detailImages={formValues.detailImages}
          onDetailImagesChange={(detailImages) => setFormValues((prev) => ({ ...prev, detailImages }))}
        />

        <aside className="admin-panel admin-form-aside">
          <h3 className="heading-3">입력 안내</h3>
          <ul className="admin-help-list">
            <li>카테고리를 먼저 선택하면 공개 제품 페이지와 연결이 쉬워집니다.</li>
            <li>한줄 요약은 1문장으로 짧게 적을수록 목록에서 읽기 쉽습니다.</li>
            <li>상세 설명은 문단을 나눠 적으면 고연령 사용자가 확인하기 편합니다.</li>
          </ul>

          <div className="admin-meta-card">
            <h4>현재 선택 정보</h4>
            <p>
              <strong>카테고리:</strong> {selectedCategory?.name ?? "선택 안 함"}
            </p>
            <p>
              <strong>공개 상태:</strong> {formValues.published ? "공개" : "비공개"}
            </p>
            <p>
              <strong>등록일:</strong> {formatDateTime(createdAt)}
            </p>
            <p>
              <strong>마지막 수정:</strong> {formatDateTime(updatedAt)}
            </p>
          </div>

          {isEditMode ? (
            <div className="admin-danger-zone">
              <h4>위험 작업</h4>
              <p className="body-text">삭제하면 공개 페이지에서도 바로 사라집니다.</p>
              <button
                type="button"
                className="btn admin-btn-danger admin-btn-lg"
                onClick={() => setShowDeleteDialog(true)}
              >
                제품 삭제
              </button>
            </div>
          ) : null}
        </aside>
      </div>

      <div className="admin-sticky-bar">
        <button
          type="button"
          className="btn btn-outline admin-btn-lg"
          onClick={() => navigate("/admin/products")}
        >
          취소
        </button>
        <button
          type="button"
          className="btn btn-outline admin-btn-lg"
          onClick={() => persistProduct(false)}
          disabled={isSubmitting}
        >
          임시 비공개 저장
        </button>
        <button
          type="button"
          className="btn btn-primary admin-btn-lg"
          onClick={() => persistProduct(true)}
          disabled={isSubmitting}
        >
          공개 저장
        </button>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="제품을 삭제하시겠습니까?"
        message="삭제한 제품은 목록과 공개 페이지에서 모두 사라집니다."
        confirmText="삭제하기"
        cancelText="계속 보관"
        destructive
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
