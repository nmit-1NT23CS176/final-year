import type { NextConfig } from "next";

const BACKEND = process.env.BACKEND_URL || process.env.ML_SERVICE_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    if (BACKEND && !BACKEND.includes("localhost")) {
      return [
        {
          source: "/api/v1/:path*",
          destination: `${BACKEND}/api/v1/:path*`,
        },
        {
          source: "/health",
          destination: `${BACKEND}/health`,
        },
      ];
    }
    return [
      {
        source: "/api/v1/forecast/:symbol",
        destination: "/api/ml/forecast/:symbol",
      },
      {
        source: "/api/v1/tickers",
        destination: "/api/ml/tickers",
      },
      {
        source: "/api/v1/model-metrics",
        destination: "/api/ml/metrics",
      },
    ];
  },
};

export default nextConfig;
