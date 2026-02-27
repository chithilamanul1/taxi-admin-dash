export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/driver/', '/checkout/', '/my-bookings/'],
        },
        sitemap: 'https://airporttaxis.lk/sitemap.xml',
    }
}
