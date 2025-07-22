import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  reactStrictMode: false,
  productionBrowserSourceMaps: true,

  webpack: (config, { isServer }) => {
    // Stub Node.js modules that are not available in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      https: false, // Add https to fallback
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
    };

    // Handle node: prefix in module imports
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        const mod = resource.request.replace(/^node:/, "");
        switch (mod) {
          case "fs":
            resource.request = "fs"; // Will be stubbed by fallback
            break;
          case "https":
            resource.request = "https"; // Will be stubbed by fallback
            break;
          case "buffer":
            resource.request = "buffer";
            break;
          case "stream":
            resource.request = "stream-browserify";
            break;
          default:
            throw new Error(`Not found ${mod}`);
        }
      })
    );

    // Provide global Buffer for libraries that require it
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      })
    );

    // Ignore source map warnings
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
  },
};

export default nextConfig;