import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import macrosPlugin from 'vite-plugin-babel-macros'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true, // 모든 호스트를 허용 (DNS 리바인딩 공격에 취약할 수 있음)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // 개발환경에서 pwa 기능활성화
      },
      manifest: {
        name: 'keywi',
        short_name: '키위',
        description:
          '1:1 키보드 견적 서비스, 나만의 키보드를 맞추고 뽐내보세요.',
        start_url: '.',
        display: 'standalone', // 네이티브앱처럼 화면 전체를 채움
        background_color: '#ffffff',
        theme_color: '#ffffff',
        lang: 'ko',
        icons: [
          {
            src: 'icons/apple-touch-icon-57x57.png',
            sizes: '57x57',
            type: 'image/png',
          },
          {
            src: 'icons/apple-touch-icon-60x60.png',
            sizes: '60x60',
            type: 'image/png',
          },
          {
            src: 'icons/apple-touch-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'icons/apple-touch-icon-114x114.png',
            sizes: '114x114',
            type: 'image/png',
          },
          {
            src: 'icons/apple-touch-icon-120x120.png',
            sizes: '120x120',
            type: 'image/png',
          },
          {
            src: 'icons/apple-touch-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'icons/apple-touch-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: 'icons/apple-touch-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'icons/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'icons/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'icons/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: 'icons/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    macrosPlugin(),
  ],
})
