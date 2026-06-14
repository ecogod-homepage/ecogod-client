import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../services/api/products";

export default function ProductDetailPage() {
  const { categorySlug, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImageKey, setSelectedImageKey] = useState("");

  useEffect(() => {
    fetchProductById(productId).then((item) => {
      setProduct(item);
      const images = item.galleryImages?.length
        ? item.galleryImages
        : item.thumbnailUrl ? [{ key: "legacy-thumbnail", url: item.thumbnailUrl, primary: true }] : [];
      setSelectedImageKey((images.find((image) => image.primary) || images[0])?.key || "");
    }).catch((requestError) => setError(requestError.message));
  }, [productId]);

  if (error) return <div className="container section"><h2>{error}</h2><Link to={`/products/${categorySlug}`}>목록으로</Link></div>;
  if (!product) return <div className="container section">제품 정보를 불러오는 중입니다.</div>;

  const galleryImages = product.galleryImages?.length
    ? product.galleryImages
    : product.thumbnailUrl ? [{ key: "legacy-thumbnail", url: product.thumbnailUrl, altText: product.name, primary: true }] : [];
  const selectedImage = galleryImages.find((image) => image.key === selectedImageKey)
    || galleryImages.find((image) => image.primary)
    || galleryImages[0];

  return (
    <article className="product-detail-page">
      <section className="product-detail-hero">
        <div className="container">
          <nav className="product-detail-breadcrumb" aria-label="현재 위치">
            <Link to="/products">PRODUCTS</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/products/${categorySlug}`}>{product.categoryName}</Link>
          </nav>

          <div className="product-detail-header">
            <div className="product-gallery">
              {galleryImages.length > 1 ? (
                <div className="product-gallery-thumbnails" aria-label="제품 이미지 선택">
                  {galleryImages.map((image, index) => (
                    <button
                      type="button"
                      key={image.key}
                      className={`product-gallery-thumbnail ${image.key === selectedImage?.key ? "is-active" : ""}`}
                      onClick={() => setSelectedImageKey(image.key)}
                      aria-label={`${product.name} 이미지 ${index + 1} 보기`}
                    >
                      <img src={image.url} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="product-detail-visual">
                {selectedImage ? (
                  <img src={selectedImage.url} alt={selectedImage.altText || `${product.name} 제품 이미지`} />
                ) : (
                  <div className="product-detail-image-empty">ECO GOD PRODUCT</div>
                )}
              </div>
            </div>

            <div className="product-detail-intro">
              <span className="section-eyebrow product-detail-eyebrow">{product.categoryName}</span>
              <h1>{product.name}</h1>
              <p className="product-detail-summary">
                {product.summary || "산업 현장의 요구 조건에 맞춘 에코가드의 전문 필터 솔루션입니다."}
              </p>

              <div className="product-detail-divider" />
              <p className="product-detail-intro-copy">
                제품 사양과 적용 환경에 대한 자세한 상담이 필요하신가요?
                에코가드의 기술 지원 팀이 현장에 적합한 솔루션을 제안해 드립니다.
              </p>
              <div className="product-detail-actions">
                <Link to="/inquiry" className="btn btn-primary">제품 견적 문의</Link>
                <Link to={`/products/${categorySlug}`} className="text-link">제품 목록으로</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section product-detail-description-section">
        <div className="container product-detail-content">
          <header className="section-header product-detail-section-header">
            <p className="section-eyebrow">PRODUCT DETAILS</p>
            <h2>제품 상세 정보</h2>
            <p className="section-description">
              제품의 주요 특징과 적용 정보를 확인하세요.
            </p>
          </header>

          {product.description ? <div className="product-detail-text">{product.description}</div> : null}
          <div className="product-detail-images">
            {(product.detailImages || []).map((image) => (
              <figure key={image.key} className="product-detail-image-frame">
                <img src={image.url} alt={image.altText || product.name} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section product-detail-cta">
        <div className="container product-detail-cta-inner">
          <span className="section-eyebrow">TECHNICAL CONSULTING</span>
          <h2>현장에 맞는 필터 솔루션을 제안해 드립니다.</h2>
          <p>제품 선정부터 맞춤 제작, 교체 주기까지 에코가드 기술팀과 상담하세요.</p>
          <Link to="/inquiry" className="btn btn-primary">지금 견적 문의하기</Link>
        </div>
      </section>
    </article>
  );
}
