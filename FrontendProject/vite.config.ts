import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// The ASP.NET Core backend has no CORS configured and forces HTTPS redirect,
// so in development we proxy /api and /uploads to it. Point VITE_API_TARGET at
// whichever backend profile you run (default: the http profile on 5117).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_TARGET || "http://localhost:5117";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
        },
        "/uploads": {
          target,
          changeOrigin: true,
          secure: false,
        },
        // SignalR hubs. ws:true upgrades the WebSocket transport.
        "/chatHub": {
          target,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        "/notificationHub": {
          target,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});
