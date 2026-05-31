/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 정적 배포 (output: export)
  output: 'export',
  trailingSlash: true,
  images: {
    // output: export 모드에서는 next/image 최적화 비활성화
    unoptimized: true,
  },
}

module.exports = nextConfig
