# Frontend AWS CI/CD

## 배포 대상
- GitHub Repository: `ecogod-homepage/ecogod-client`
- Branch: `main`
- Site URL: `https://www.ecogod.kr`
- S3 Bucket: `ecogod-frontend-site`
- CloudFront Distribution: `E2MCI60CWPUFN9`
- API Base URL: `https://api.ecogod.kr`

## 파이프라인 개요
1. `main` 브랜치 push 또는 수동 실행
2. `npm ci`
3. `npm run build`
4. `dist/` 산출물을 S3에 업로드
5. HTML 파일은 no-cache 정책으로 별도 업로드
6. CloudFront 전체 캐시 무효화

## GitHub Actions 파일
- `/Users/jeonjaeyeon/Desktop/ecogad/ecogad_front/.github/workflows/ci.yml`
- `/Users/jeonjaeyeon/Desktop/ecogad/ecogad_front/.github/workflows/cd-aws.yml`

## GitHub Secrets
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## GitHub Variables
- `AWS_REGION=ap-northeast-2`
- `AWS_S3_BUCKET_NAME=ecogod-frontend-site`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID=E2MCI60CWPUFN9`
- `VITE_API_BASE_URL=https://api.ecogod.kr`

## 캐시 정책
- `*.html`: `no-cache, no-store, must-revalidate`
- 그 외 정적 파일: `public, max-age=31536000, immutable`

## 운영 메모
- SPA 라우팅은 CloudFront + S3 정적 사이트 설정에 의존한다.
- API 호출은 빌드 시점 `VITE_API_BASE_URL` 값을 사용한다.
- Vercel 관련 시크릿은 더 이상 필요하지 않다.
