import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://datapols.com'
    const locales = ['hy', 'en', 'ru']

    const routes = ['', '/news', '/videos'].map((route) => {
        return locales.map((lang) => ({
            url: `${baseUrl}/${lang}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    }).flat()

    return routes
}
