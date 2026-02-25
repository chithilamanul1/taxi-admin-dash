/**
 * Simple slugifier to convert strings into URL-friendly slugs.
 * @param {string} text - The string to slugify.
 * @returns {string} - The slugified string.
 */
export function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove all non-word chars
        .replace(/--+/g, '-')       // Replace multiple - with single -
        .slice(0, 100);              // Limit length
}
