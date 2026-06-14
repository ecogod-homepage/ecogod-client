import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../services/api/products";

export default function ProductDetailPage() {
  const { categorySlug, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductById(productId).then(setProduct).catch((requestError) => setError(requestError.message));
  }, [productId]);

  if (error) return <div className="container section"><h2>{error}</h2><Link to={`/products/${categorySlug}`}>목록으로</Link></div>;
  if (!product) return <div className="container section">제품 정보를 불러오는 중입니다.</div>;

  return (
    <article className="product-detail-page">
      <header className="product-detail-header container">
        {product.thumbnailUrl ? <img src={product.thumbnailUrl} alt={`${product.name} 대표 이미지`} /> : null}
        <div>
          <span className="section-eyebrow">{product.categoryName}</span>
          <h1 className="heading-1">{product.name}</h1>
          <p className="body-text">{product.summary}</p>
          <Link to="/inquiry" className="btn btn-primary">제품 문의하기</Link>
        </div>
      </header>
      <section className="product-detail-content container">
        {product.description ? <div className="product-detail-text">{product.description}</div> : null}
        <div className="product-detail-images">
          {(product.detailImages || []).map((image) => (
            <img key={image.key} src={image.url} alt={image.altText || product.name} loading="lazy" />
          ))}
        </div>
      </section>
    </article>
  );
}
