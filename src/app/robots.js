export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/admin/'],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Anthropic-AI', 'Claude-Web', 'CCBot'],
                allow: '/',
            }
        ],
        sitemap: 'https://srilankantaxi.lk/sitemap.xml',
    }
}
