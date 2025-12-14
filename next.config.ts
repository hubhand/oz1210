import type { NextConfig } from "next";

// 번들 분석 도구 설정 (환경변수로 제어)
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Clerk 프로필 이미지
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      // 한국관광공사 이미지 (tong 도메인)
      // firstimage, firstimage2 필드에서 사용
      {
        protocol: "https",
        hostname: "tong.visitkorea.or.kr",
      },
      // http 프로토콜도 허용 (일부 이미지가 http로 제공될 수 있음)
      {
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
      },
      // 한국관광공사 API 이미지 (api 도메인)
      // originimgurl, smallimageurl 필드에서 사용
      {
        protocol: "https",
        hostname: "api.visitkorea.or.kr",
      },
    ],
  },

  // Next.js 15.5.7에서는 experimental.turbo가 deprecated되었습니다.
  // Turbopack은 기본적으로 비활성화되어 있으며, 필요시 turbopack 설정을 사용할 수 있습니다.

  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            clerk: {
              name: "clerk",
              chunks: "all",
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
              priority: 20,
              enforce: true,
            },
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          },
        },
      };
    }

    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/hiberfil.sys",
          "**/pagefile.sys",
          "**/swapfile.sys",
          "**/DumpStack.log.tmp",
        ],
      };

      config.resolve = {
        ...config.resolve,
        symlinks: false,
        // 개발 환경에서 캐시 비활성화하여 모듈 해상도 문제 방지
        cache: false,
      };

      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: config.optimization?.splitChunks,
      };
    }

    return config;
  },

  ...(process.env.NODE_ENV === "development" && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 5,
    },
  }),
};

export default withBundleAnalyzer(nextConfig);
