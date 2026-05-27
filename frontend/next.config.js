/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 정적 배포 (output: export)
  output: 'export',
  trailingSlash: true,
  images: {
    // output: export 모드에서는 next/image 최적화 비활성화
    unoptimized: true,
  },
  // 백엔드 API 프록시 (개발 환경)
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*',
        },
      ]
    }
    return []
  },
}

module.exports = nextConfig
