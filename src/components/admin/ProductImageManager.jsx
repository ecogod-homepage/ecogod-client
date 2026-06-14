import { useRef, useState } from "react";
import { deleteProductImage, uploadProductImage } from "../../services/api/adminUploads";

export default function ProductImageManager({ thumbnailUrl, onThumbnailChange, detailImages, onDetailImagesChange }) {
  const thumbnailInput = useRef(null);
  const detailInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadThumbnail(file) {
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const uploaded = await uploadProductImage(file);
      onThumbnailChange(uploaded.url);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  }

  async function uploadDetails(files) {
    if (!files?.length) return;
    try {
      setUploading(true);
      setError("");
      const uploaded = [];
      for (const file of files) {
        const result = await uploadProductImage(file);
        uploaded.push({
          key: result.key,
          url: result.url,
          altText: file.name.replace(/\.[^.]+$/, ""),
          sortOrder: detailImages.length + uploaded.length
        });
      }
      onDetailImagesChange([...detailImages, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  }

  function updateImage(index, patch) {
    onDetailImagesChange(detailImages.map((image, imageIndex) => imageIndex === index ? { ...image, ...patch } : image));
  }

  function move(index, offset) {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= detailImages.length) return;
    const next = [...detailImages];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onDetailImagesChange(next.map((image, sortOrder) => ({ ...image, sortOrder })));
  }

  async function remove(index) {
    const image = detailImages[index];
    onDetailImagesChange(detailImages.filter((_, imageIndex) => imageIndex !== index)
      .map((item, sortOrder) => ({ ...item, sortOrder })));
    if (image.key) {
      try {
        await deleteProductImage(image.key);
      } catch {
        setError("목록에서는 제거했지만 S3 이미지 삭제에 실패했습니다.");
      }
    }
  }

  return (
    <section className="admin-image-manager">
      <h3 className="heading-3">제품 이미지</h3>
      {error ? <div className="admin-banner error">{error}</div> : null}

      <div className="admin-image-upload-block">
        <strong>썸네일 이미지</strong>
        {thumbnailUrl ? <img src={thumbnailUrl} alt="현재 제품 썸네일" className="admin-image-preview" /> : null}
        <input ref={thumbnailInput} type="file" accept="image/jpeg,image/png,image/webp" hidden
          onChange={(event) => uploadThumbnail(event.target.files?.[0])} />
        <button type="button" className="btn btn-outline" disabled={uploading}
          onClick={() => thumbnailInput.current?.click()}>
          {thumbnailUrl ? "썸네일 교체" : "썸네일 업로드"}
        </button>
      </div>

      <div className="admin-image-upload-block">
        <strong>상세설명 이미지</strong>
        <p className="body-text">등록 순서대로 제품 상세페이지에 세로로 표시됩니다.</p>
        <input ref={detailInput} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden
          onChange={(event) => uploadDetails([...event.target.files])} />
        <button type="button" className="btn btn-outline" disabled={uploading}
          onClick={() => detailInput.current?.click()}>
          상세 이미지 추가
        </button>
      </div>

      <div className="admin-detail-image-list">
        {detailImages.map((image, index) => (
          <article className="admin-detail-image-item" key={`${image.key}-${index}`}>
            <img src={image.url} alt={image.altText || `상세 이미지 ${index + 1}`} />
            <input className="admin-input" value={image.altText || ""} placeholder="이미지 설명"
              onChange={(event) => updateImage(index, { altText: event.target.value })} />
            <div className="admin-detail-image-actions">
              <button type="button" className="btn btn-outline" onClick={() => move(index, -1)} disabled={index === 0}>위로</button>
              <button type="button" className="btn btn-outline" onClick={() => move(index, 1)} disabled={index === detailImages.length - 1}>아래로</button>
              <button type="button" className="btn admin-btn-danger" onClick={() => remove(index)}>삭제</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
