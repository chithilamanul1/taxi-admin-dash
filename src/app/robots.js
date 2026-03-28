export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/driver/', '/checkout/', '/my-bookings/'],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot'],
                allow: ['/', '/llms.txt'],
                disallow: ['/admin/', '/api/'],
            }
        ],
        sitemap: 'https://srilankantaxi.lk/sitemap.xml',
    }
}
