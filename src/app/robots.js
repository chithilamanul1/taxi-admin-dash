export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/booking/', '/payment/'],
            }
        ],
        sitemap: 'https://airporttaxi.lk/sitemap.xml',
    }
}
