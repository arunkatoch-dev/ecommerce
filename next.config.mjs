/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "http" || "https",
            hostname: "localhost",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: "/**",
          },
        ],
      },
};

export default nextConfig;
