/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Désactive ESLint uniquement lors du build sur Vercel
  },
};

export default nextConfig;
