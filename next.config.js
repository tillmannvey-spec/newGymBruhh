/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  }
}

module.exports = nextConfig