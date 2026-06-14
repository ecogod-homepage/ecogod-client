import { useRef, useState } from "react";
import { deleteProductImage, uploadProductImage } from "../../services/api/adminUploads";

function normalizeOrder(images) {
  return images.map((image, sortOrder) => ({ ...image, sortOrder }));
}

function ensurePrimary(images) {
  if (!images.length || images.some((image) => image.primary)) return images;
  return images.map((image, index) => ({ ...image, primary: index === 0 }));
}

export default function ProductImageManager({
  galleryImages,
  onGalleryImagesChange,
  detailImages,
  onDetailImagesChange
}) {
  const galleryInput = useRef(null);
  const detailInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadImages(files, type) {
    if (!files?.length) return;
    try {
      setUploading(true);
      setError("");
      const current = type === "gallery" ? galleryImages : detailImages;
      const uploaded = [];
      for (const file of files) {
        const result = await uploadProductImage(file);
        uploaded.push({
          key: result.key,
          url: result.url,
          altText: file.name.replace(/\.[^.]+$/, ""),
          sortOrder: current.length + uploaded.length,
          ...(type === "gallery" ? { primary: current.length === 0 && uploaded.length === 0 } : {})
        });
      }
      const next = [...current, ...uploaded];
      type === "gallery" ? onGalleryImagesChange(ensurePrimary(next)) : onDetailImagesChange(next);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  }

  function update(type, index, patch) {
    const current = type === "gallery" ? galleryImages : detailImages;
    const next = current.map((image, imageIndex) => imageIndex === index ? { ...image, ...patch } : image);
    type === "gallery" ? onGalleryImagesChange(next) : onDetailImagesChange(next);
  }

  function move(type, index, offset) {
    const current = type === "gallery" ? galleryImages : detailImages;
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= current.length) return;
    const next = [...current];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    type === "gallery" ? onGalleryImagesChange(normalizeOrder(next)) : onDetailImagesChange(normalizeOrder(next));
  }

  async function remove(type, index) {
    const current = type === "gallery" ? galleryImages : detailImages;
    const image = current[index];
    const next = normalizeOrder(current.filter((_, imageIndex) => imageIndex !== index));
    type === "gallery" ? onGalleryImagesChange(ensurePrimary(next)) : onDetailImagesChange(next);
    if (image.key) {
      try {
        await deleteProductImage(image.key);
      } catch {
        setError("목록에서는 제거했지만 저장소 이미지 삭제에 실패했습니다.");
      }
    }
  }

  function setPrimary(index) {
    onGalleryImagesChange(galleryImages.map((image, imageIndex) => ({ ...image, primary: imageIndex === index })));
  }

  function renderList(type, images) {
    return (
      <div className="admin-detail-image-list">
        {images.map((image, index) => (
          <article className={`admin-detail-image-item ${image.primary ? "is-primary" : ""}`} key={`${image.key}-${index}`}>
            <div className="admin-image-thumb-wrap">
              <img src={image.url} alt={image.altText || `${type === "gallery" ? "갤러리" : "상세"} 이미지 ${index + 1}`} />
              {image.primary ? <span className="admin-image-primary-badge">대표 이미지</span> : null}
            </div>
            <input className="admin-input" value={image.altText || ""} placeholder="이미지 설명"
              onChange={(event) => update(type, index, { altText: event.target.value })} />
            <div className="admin-detail-image-actions">
              {type === "gallery" && !image.primary ? (
                <button type="button" className="btn btn-primary" onClick={() => setPrimary(index)}>대표 지정</button>
              ) : null}
              <button type="button" className="btn btn-outline" onClick={() => move(type, index, -1)} disabled={index === 0}>위로</button>
              <button type="button" className="btn btn-outline" onClick={() => move(type, index, 1)} disabled={index === images.length - 1}>아래로</button>
              <button type="button" className="btn admin-btn-danger" onClick={() => remove(type, index)}>삭제</button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section className="admin-image-manager">
      <h3 className="heading-3">제품 이미지</h3>
      {error ? <div className="admin-banner error">{error}</div> : null}

      <div className="admin-image-upload-block">
        <strong>제품 갤러리 이미지</strong>
        <p className="body-text">제품 상세 상단에서 썸네일을 눌러 여러 방향의 이미지를 확인합니다. 대표 이미지는 목록에도 사용됩니다.</p>
        <input ref={galleryInput} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden
          onChange={(event) => uploadImages([...event.target.files], "gallery")} />
        <button type="button" className="btn btn-outline" disabled={uploading}
          onClick={() => galleryInput.current?.click()}>
          갤러리 이미지 추가
        </button>
        {renderList("gallery", galleryImages)}
      </div>

      <div className="admin-image-upload-block admin-image-section-divider">
        <strong>상세설명 이미지</strong>
        <p className="body-text">등록 순서대로 제품 상세페이지 본문에 세로로 표시됩니다.</p>
        <input ref={detailInput} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden
          onChange={(event) => uploadImages([...event.target.files], "detail")} />
        <button type="button" className="btn btn-outline" disabled={uploading}
          onClick={() => detailInput.current?.click()}>
          상세 이미지 추가
        </button>
        {renderList("detail", detailImages)}
      </div>
    </section>
  );
}
