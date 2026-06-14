import React, { useState } from "react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import { submitInquiry } from "../services/api/inquiries";

const InquiryPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
    agree: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage("");
      await submitInquiry({
        name: formData.name,
        companyName: formData.company,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        privacyAgreed: formData.agree
      });
      setStatusMessage("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
      setFormData({ name: "", company: "", phone: "", email: "", message: "", agree: false });
    } catch (error) {
      setStatusMessage(error.message ?? "문의 접수에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inquiry-page">
      <PageHero
        title="Get a Quote"
        subtitle="프로젝트 규모와 요구사항을 남겨주시면 전문가가 상세한 견적을 제안드립니다."
        bgImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80"
        imageAlt="회의실에서 상담하는 기업 담당자"
      />

      <section className="section container">
        <SectionHeader
          eyebrow="CONTACT US"
          title="견적 문의"
          description="빠른 시일 내에 이메일 또는 유선으로 회신 드리겠습니다."
        />

        <div className="inquiry-form-wrap">
          {statusMessage ? <div className="admin-banner">{statusMessage}</div> : null}
          <form className="inquiry-form" onSubmit={handleSubmit}>
            <div className="inquiry-row">
              <div className="form-field">
                <label htmlFor="name">이름 *</label>
                <input id="name" type="text" name="name" required className="form-input" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="company">회사명</label>
                <input id="company" type="text" name="company" required className="form-input" value={formData.company} onChange={handleChange} />
              </div>
            </div>

            <div className="inquiry-row">
              <div className="form-field">
                <label htmlFor="phone">연락처 *</label>
                <input id="phone" type="tel" name="phone" required className="form-input" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="email">이메일 *</label>
                <input id="email" type="email" name="email" required className="form-input" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="message">문의내용 *</label>
              <textarea
                id="message"
                name="message"
                required
                rows="6"
                className="form-input form-textarea"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="inquiry-consent">
              <input
                id="agree"
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <label htmlFor="agree">[필수] 개인정보 수집 및 이용에 동의합니다.</label>
            </div>

            <button type="submit" className="btn btn-primary inquiry-submit" disabled={isSubmitting}>
              {isSubmitting ? "접수 중..." : "문의 접수하기"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default InquiryPage;
