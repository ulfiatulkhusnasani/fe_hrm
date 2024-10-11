/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Atur fallback untuk modul yang tidak tersedia di klien
        config.resolve.fallback = { 
            fs: false, 
            path: false, 
            os: false 
        };

        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/login',
                destination: 'http://127.0.0.1:8000/api/login', // URL backend API
            },
        ];
    },
};

module.exports = nextConfig;
