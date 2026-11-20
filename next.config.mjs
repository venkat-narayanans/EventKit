/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/portal",
        destination: "/?view=portal",
      },
      {
        source: "/dashboard",
        destination: "/?view=dashboard",
      },
      {
        source: "/workspace",
        destination: "/?view=dashboard",
      },
      {
        source: "/organizer",
        destination: "/?view=dashboard",
      },
    ];
  },
};

export default nextConfig;
