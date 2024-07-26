/** @type {import('next').NextConfig.webpack} */
// export function webpack(config) {
//   config.module.rules.push({
//     test: /\.svg$/i,
//     use: ["@svgr/webpack"],
//   });
//   return config;
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  output: "standalone",
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  redirects() {
    return [
      {
        source: "/",
        destination: "/account",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
