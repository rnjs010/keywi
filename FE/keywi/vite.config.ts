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
      includeAssets: ['icons/*'],
      manifest: {
        name: 'keywi',
        short_name: '키위',
        description:
          '1:1 키보드 견적 서비스, 나만의 키보드를 맞추고 뽐내보세요.',
        start_url: '/',
        display: 'standalone', // 네이티브앱처럼 화면 전체를 채움
        background_color: '#ffffff',
        theme_color: '#ffffff',
        lang: 'ko',
        icons: [
          // Android 아이콘
          {
            src: 'icons/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png',
          },
          {
            src: 'icons/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: 'icons/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'icons/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'icons/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'icons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },

          // Apple 아이콘
          {
            src: 'icons/apple-icon-57x57.png',
            sizes: '57x57',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-60x60.png',
            sizes: '60x60',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-76x76.png',
            sizes: '76x76',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-114x114.png',
            sizes: '114x114',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-120x120.png',
            sizes: '120x120',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon-precomposed.png',
            type: 'image/png',
          },
          {
            src: 'icons/apple-icon.png',
            type: 'image/png',
          },

          // Favicon 아이콘
          {
            src: 'icons/favicon-16x16.png',
            sizes: '16x16',
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
            src: 'icons/favicon.ico',
            sizes: '36x36',
            type: 'image/x-icon',
          },

          // Microsoft 아이콘
          {
            src: 'icons/ms-icon-70x70.png',
            sizes: '70x70',
            type: 'image/png',
          },
          {
            src: 'icons/ms-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'icons/ms-icon-150x150.png',
            sizes: '150x150',
            type: 'image/png',
          },
          {
            src: 'icons/ms-icon-310x310.png',
            sizes: '310x310',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    macrosPlugin(),
  ],
})
