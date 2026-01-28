export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/booking/', '/payment/'],
            }
        ],
        sitemap: 'https://airporttaxis.lk/sitemap.xml',
    }
}
