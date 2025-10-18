/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-0b7d9313ccd845eea585e4c55b5f51a6.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_API_HOST || 'http://localhost:8080'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
