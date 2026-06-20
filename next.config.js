import nextConst from 'next/constants.js'

export default async function setup(phase) {
  if (phase === nextConst.PHASE_DEVELOPMENT_SERVER || phase === nextConst.PHASE_PRODUCTION_SERVER) {
    const requiredVariables = ['DB_DRIVER', 'DB_CONNECTION_URL', 'AUTH_SECRET']
    const unsetEnv = requiredVariables.filter((variable) => !process.env[variable])
    if (!process.env.AUTH_URL && process.env.VERCEL_URL) {
      process.env.AUTH_URL = process.env.VERCEL_URL
    }
    if (process.env.NODE_ENV === 'production' && !process.env.AUTH_URL) {
      unsetEnv.push('AUTH_URL')
    }
    if (unsetEnv.length) {
      console.error('\n环境变量缺失: ' + unsetEnv.join(', ') + '\n')
      process.exit(1)
    }
    if (process.env.DB_DRIVER !== 'postgresql' && process.env.DB_DRIVER !== 'sqlite') {
      console.error('\nDB_DRIVER 只能为 postgresql 或 sqlite\n')
      process.exit(1)
    }
  }

  const domainHost = new URL(process.env.AUTH_URL || 'http://localhost').host

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.iconify.design',
          pathname: '**',
        },
        process.env.NEXT_PUBLIC_WEBSITE_LOGO
          ? new URL(process.env.NEXT_PUBLIC_WEBSITE_LOGO)
          : undefined,
      ].filter(Boolean),
      dangerouslyAllowSVG: true,
    },
    experimental: {
      serverActions: { allowedOrigins: [domainHost] },
    },
    typescript: {
      ignoreBuildErrors: Boolean(process.env.IGNORE_BUILD_ERRORS),
    },
    allowedDevOrigins: ['127.0.0.1'],
  }
  return nextConfig
}
