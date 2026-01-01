import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import manifest from './manifest.json';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon*.png'],
            manifest,
            workbox: {
                runtimeCaching: [
                    { // articles
                        urlPattern: ({ url }) => {
                            // return url.searchParams.get('dic')
                            return url.searchParams.get('request')
                                || url.pathname.includes('/fetchWebsiteContent');
                        },
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'articles',
                            expiration: {
                                maxEntries: 200
                            }
                        }
                    },
                    { // json-lib
                        urlPattern: ({ url }) => url.pathname.endsWith('.json'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'jsonLib'
                        }
                    }
                ]
            }
        })
    ]
});