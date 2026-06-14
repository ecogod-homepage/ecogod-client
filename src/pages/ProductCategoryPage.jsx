import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import EmptyState from "../components/common/EmptyState";
import {
  fetchCategoryBySlug,
  fetchProductsByCategory,
  fetchPublicCategories
} from "../services/api/products";

const ProductCategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const [categoryItems, currentCategory, productItems] = await Promise.all([
        fetchPublicCategories(),
        fetchCategoryBySlug(categorySlug),
        fetchProductsByCategory(categorySlug)
      ]);

      if (!ignore) {
        setCategories(categoryItems);
        setCategory(currentCategory);
        setProducts(productItems);
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [categorySlug]);

  if (isLoading) {
    return <div className="container section category-state-wrap">카테고리를 불러오는 중입니다.</div>;
  }

  if (!category) {
    return (
      <div className="container section category-state-wrap">
        <h2 className="heading-2">존재하지 않는 카테고리입니다.</h2>
        <Link to="/products" className="btn btn-primary category-state-button">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="product-category-page">
      <PageHero
        title={category.name}
        subtitle={category.description}
        bgImage="https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2574&auto=format&fit=crop"
        imageAlt={`${category.name} 카테고리 대표 이미지`}
      />

      <section className="section container">
        <div className="product-category-tabs" aria-label="제품 카테고리 탭">
          {categories.map((item) => {
            const isActive = item.slug === categorySlug;

            return (
              <Link
                key={item.id}
                to={`/products/${item.slug}`}
                className={`btn btn-outline product-category-tab ${isActive ? "active" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {products.length > 0 ? (
          <div className="card-grid product-card-grid">
            {products.map((product) => (
              <Link to={`/products/${categorySlug}/${product.id}`} key={product.id} className="product-category-card">
                {product.thumbnailUrl ? (
                  <div className="product-category-card-image">
                    <img src={product.thumbnailUrl} alt={`${product.name} 대표 이미지`} loading="lazy" />
                  </div>
                ) : null}
                <div className="product-category-card-body product-item-card-body">
                  <div>
                    <h3 className="heading-3 product-category-title">{product.name}</h3>
                    <p className="body-text">{product.summary || "요약 설명이 아직 등록되지 않았습니다."}</p>
                  </div>

                  <p className="product-item-description">
                    {product.description || "상세 설명은 관리자 페이지에서 등록할 수 있습니다."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="등록된 제품이 없습니다"
            message={`현재 '${category.name}' 카테고리에 등록된 제품 정보가 준비 중입니다. 관리자 페이지에서 제품을 등록하면 이곳에 표시됩니다.`}
            actionText="제품 문의하기"
            onAction={() => {
              window.location.href = "/inquiry";
            }}
          />
        )}
      </section>
    </div>
  );
};

export default ProductCategoryPage;
