/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    const path = require('path')
    
    // Use webpack's NormalModuleReplacementPlugin to replace the import
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@splinetool\/react-spline$/,
        (resource) => {
          // Replace with direct path to dist file
          const distPath = path.resolve(
            __dirname,
            'node_modules',
            '@splinetool',
            'react-spline',
            'dist',
            'react-spline.js'
          )
          resource.request = distPath
        }
      )
    )
    
    // Also set up alias as fallback
    if (!isServer) {
      const splineDistPath = path.resolve(
        __dirname,
        'node_modules',
        '@splinetool',
        'react-spline',
        'dist',
        'react-spline.js'
      )
      config.resolve.alias = {
        ...config.resolve.alias,
        '@splinetool/react-spline': splineDistPath,
      }
    }
    
    // Allow importing from dist folders
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    }
    
    return config
  },
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
}

module.exports = nextConfig

