const fs = require('fs');

let content = fs.readFileSync('src/app/layout.js', 'utf8');

content = content.replace('const jsonLd = {', 'const getJsonLd = (baseUrl) => ({\n');
content = content.replace(/https:\/\/airporttaxis\.lk/g, '${baseUrl}');

// Fix the end of jsonLd
const endOfJson = content.indexOf('    ]\n}') + 6;
content = content.substring(0, endOfJson) + ')' + content.substring(endOfJson);

content = content.replace('export default function RootLayout({ children }) {', 
`export default async function RootLayout({ children }) {
    const headersList = await headers();
    const host = headersList.get('host') || 'airporttaxis.lk';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = \`\${protocol}://\${host}\`;
    const jsonLd = getJsonLd(baseUrl);
`);

fs.writeFileSync('src/app/layout.js', content);
console.log('Done');
