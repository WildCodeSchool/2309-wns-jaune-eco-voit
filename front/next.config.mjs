/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/avatar/*",
      },
      {
        protocol: "https",
        hostname: "www.santelog.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  distDir: "build",
};

export default nextConfig;
