import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const GUIDE_BY_ROUTE = [
  {
    match: (pathname) => pathname.startsWith("/admin/products"),
    title: "제품 관리 가이드",
    items: [
      "새 제품 등록 버튼으로 먼저 기본 정보를 입력하고 저장합니다.",
      "이미지는 파일 첨부 버튼으로 올리면 업로드 후 주소가 자동 입력됩니다.",
      "공개 저장을 누른 제품만 공개 제품 페이지에 노출됩니다."
    ]
  },
  {
    match: (pathname) => pathname.startsWith("/admin/categories"),
    title: "카테고리 관리 가이드",
    items: [
      "카테고리명과 설명은 공개 제품 페이지 상단 탭과 소개 영역에 함께 사용됩니다.",
      "사용 중인 카테고리는 연결된 제품을 정리한 뒤 삭제할 수 있습니다.",
      "노출 순서를 낮게 둘수록 제품 및 서비스 목록에서 먼저 보입니다."
    ]
  },
  {
    match: (pathname) => pathname.startsWith("/admin/notices"),
    title: "공지 관리 가이드",
    items: [
      "공지 요약은 목록 카드에서 먼저 노출되므로 핵심만 짧게 작성하는 편이 좋습니다.",
      "비공개 저장 상태에서는 공개 공지사항 페이지에 노출되지 않습니다.",
      "상세 내용은 문단을 나누어 작성하면 가독성이 좋아집니다."
    ]
  }
];

const DEFAULT_GUIDE = {
  title: "관리자 페이지 사용 가이드",
  items: [
    "왼쪽 메뉴에서 관리할 항목을 선택한 뒤 목록에서 바로 수정할 수 있습니다.",
    "공개 여부는 실제 홈페이지 노출 상태와 연결되므로 저장 전에 다시 확인해 주세요.",
    "오류가 발생하면 상단 안내 문구를 먼저 확인하면 대부분의 입력 문제를 바로 찾을 수 있습니다."
  ]
};

export default function AdminUsageGuide() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const guide = useMemo(
    () => GUIDE_BY_ROUTE.find((item) => item.match(pathname)) ?? DEFAULT_GUIDE,
    [pathname]
  );

  return (
    <section className="admin-guide-panel" aria-label="관리자 페이지 사용 가이드">
      <button
        type="button"
        className="admin-guide-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div>
          <p className="admin-guide-eyebrow">사용 가이드</p>
          <h2 className="admin-guide-title">{guide.title}</h2>
        </div>
        <span className="admin-guide-toggle-text">{isOpen ? "접기" : "펼치기"}</span>
      </button>

      {isOpen ? (
        <ul className="admin-guide-list">
          {guide.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
