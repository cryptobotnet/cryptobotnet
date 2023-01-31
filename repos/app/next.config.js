// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const config = {
  pageExtensions: ['page.tsx', 'page.ts', 'rest.ts'],
  poweredByHeader: false,

  eslint: {
    dirs: ['src']
  },

  images: {
    deviceSizes: [320, 768, 1024, 1440, 1680, 1920]
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  }
}

module.exports = config
