import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      // thêm các domain khác nếu cần
    ],
  },
  /* config options here */
};

export default nextConfig;
