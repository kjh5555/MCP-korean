/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정만 유지
  experimental: {
    // turbo 객체로 설정
    turbo: {
      enabled: true
    }
  }
};

module.exports = nextConfig; 