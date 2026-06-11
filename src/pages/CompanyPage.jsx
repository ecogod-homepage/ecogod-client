import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import brandFullLogo from "../assets/ecogod-logo-request.png";

const histories = [
  {
    year: "2025",
    title: "특수 산업용 필터 라인 고도화",
    text: "화력발전소·방전가공기·유압오일 MIST 대응 라인업을 통합 설계 체계로 개편"
  },
  {
    year: "2023",
    title: "안산 기술영업 거점 확장",
    text: "경기도 안산시 단원구 타원TAKRAIII에 기술영업 및 고객 대응 거점을 확장 운영"
  },
  {
    year: "2018",
    title: "현장 맞춤 설계 역량 강화",
    text: "집진기, 수처리, 공기정화 설비별 맞춤 필터 사양 설계 및 제작 프로세스 정착"
  },
  {
    year: "2012",
    title: "ECO GOD Co.,Ltd. 설립",
    text: "산업용 필터 설계·제조 전문 기업으로 출범하여 현장 중심 생산 체계를 구축"
  }
];

const CompanyPage = () => {
  return (
    <div className="company-page">
      <PageHero
        title="Company Introduction"
        subtitle="산업 현장의 공기 품질 문제를 해결하는 필터 엔지니어링 기업, ECO GOD입니다."
        bgImage="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1800&q=80"
        imageAlt="산업 시설 전경"
      />

      <section className="section company-identity-section">
        <div className="container company-identity-grid">
          <img
            src={brandFullLogo}
            alt="ECO GOD 회사 CI"
            className="company-identity-logo"
            loading="lazy"
          />

          <article className="company-identity-card" aria-label="회사 기본 정보">
            <h2 className="heading-2">(주)에코가드 | ECO GOD Co.,Ltd.</h2>
            <p className="body-text company-identity-description">
              THE SMILE OF HONEYBEE 철학을 기반으로 산업용 필터를 설계·제조하며,
              설비 특성에 맞춘 실사용 성능 중심 솔루션을 제공합니다.
            </p>
            <ul className="company-identity-list">
              <li>대표: 전철환 (CHEOL HWAN JEON)</li>
              <li>주소: 경기도 안산시 단원구 만해로 205 타원TAKRAIII 3층 A-315호</li>
              <li>Tel. 031-380-0329 / Mob. 010-5223-5879 / Fax. 031-437-6360</li>
              <li>E-mail. filter0524@naver.com</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section company-ceo-section">
        <div className="container company-ceo-grid">
          <div>
            <span className="section-eyebrow company-ceo-eyebrow">CEO GREETING</span>
            <h2 className="heading-1 company-ceo-title">
              현장에 필요한 성능을,
              <br />
              정확하게 설계하고 끝까지 책임지겠습니다.
            </h2>
            <div className="body-text company-ceo-body">
              <p>
                안녕하십니까. ECO GOD 대표이사 전철환입니다. 저희는 산업용 필터를 단순한
                소모품이 아닌, 설비 안정성과 작업자 안전을 지키는 핵심 장비로 바라보고 있습니다.
              </p>
              <p>
                화력발전소, 방전가공기, 집진기, 수처리, 공기정화 시스템 등 각 현장은
                운전 조건과 오염원 특성이 다릅니다. ECO GOD는 현장 조건 분석을 바탕으로
                구조, 소재, 유지주기까지 최적화된 필터를 설계·제조합니다.
              </p>
              <p>
                앞으로도 고객 생산 환경의 연속성과 효율을 높이는 신뢰 가능한 파트너로서,
                검증된 품질과 빠른 기술 대응으로 보답하겠습니다.
              </p>
            </div>

            <div className="ceo-signature">
              <span className="signature-line" />
              <span className="company-ceo-role">ECO GOD Co.,Ltd. 대표이사</span>
              <span className="signature-text">CHEOL HWAN JEON</span>
            </div>
          </div>

          <div className="company-ceo-image-wrap">
            <div className="company-ceo-image-bg" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1632&q=80"
              alt="ECO GOD 대표 인사 이미지"
              className="company-ceo-image"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section bg-gray">
        <div className="container">
          <SectionHeader
            eyebrow="MANAGEMENT PHILOSOPHY"
            title="기업 운영 원칙"
            description="ECO GOD는 다음 세 가지 원칙으로 고객 현장의 성능 신뢰를 지켜갑니다."
          />
          <div className="philosophy-grid">
            <article className="philosophy-item">
              <span className="philosophy-number">01</span>
              <h3 className="heading-3">Precision Design</h3>
              <p className="body-text">
                설비 조건과 오염 특성을 데이터로 분석해 현장에 맞는 필터 구조를 설계합니다.
              </p>
            </article>
            <article className="philosophy-item">
              <span className="philosophy-number">02</span>
              <h3 className="heading-3">Operational Reliability</h3>
              <p className="body-text">
                초기 성능뿐 아니라 운전 기간 전체의 안정성을 기준으로 제작과 검증을 수행합니다.
              </p>
            </article>
            <article className="philosophy-item">
              <span className="philosophy-number">03</span>
              <h3 className="heading-3">Rapid Field Support</h3>
              <p className="body-text">
                납기, 교체, 유지보수 대응을 표준화하여 고객의 다운타임 최소화를 지원합니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="HISTORY"
            title="연혁"
            description="ECO GOD는 산업용 필터 전문성과 현장 신뢰를 기반으로 성장해 왔습니다."
          />
          <div className="history-container">
            {histories.map((history) => (
              <article key={history.year} className="history-item">
                <div className="history-year">{history.year}</div>
                <div className="history-dot" />
                <div className="history-content">
                  <h4>{history.title}</h4>
                  <p className="body-text">{history.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section company-cta-section">
        <div className="container company-cta-container">
          <span className="section-eyebrow company-cta-eyebrow">ENGINEERING PARTNER</span>
          <h2 className="heading-2 company-cta-title">현장 조건 기반 맞춤 필터 상담을 진행합니다.</h2>
          <p className="body-text company-cta-desc">
            산업 설비 조건, 운전 환경, 교체 주기를 함께 검토해 가장 실효성 있는 제품과
            운영 계획을 제안드립니다.
          </p>
          <div className="company-cta-actions">
            <Link to="/products" className="btn btn-primary">
              제품 라인업 확인
            </Link>
            <Link to="/inquiry" className="btn btn-outline btn-outline-light">
              견적 및 기술 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyPage;
