/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['45.32.106.84', '157.10.44.228', 'mephar.acdtech.asia', 'mephar-staging-api.acdtech.asia', 'mephar-dev-api.acdtech.asia', 'mephar-sit-api.acdtech.asia', 'mephar-sit.acdtech.asia', 'cdn2-retail-images.kiotviet.vn', 'cdn-images.kiotviet.vn', 'chothuoc24h.vn'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
});
