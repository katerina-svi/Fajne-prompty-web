const fs = require('fs');
const path = require('path');

const dirs = [
    'public/images/team',
    'public/images/partners',
    'content/events/20260323/media',
    'content/events/20251002/media'
];

dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
});

function createSvg(width, height, color, text) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
}

const images = [
    { path: 'public/images/team/katerina.jpg', color: '#db2777', text: 'Katerina' },
    { path: 'public/images/team/martin.jpg', color: '#7c3aed', text: 'Martin' },
    { path: 'public/images/team/filip.jpg', color: '#1e40af', text: 'Filip' },
    { path: 'public/images/partners/gug-logo.png', color: '#15803d', text: 'GUG' },
    { path: 'public/images/partners/cerna-kostka-logo.png', color: '#9ca3af', text: 'Kostka' },
    { path: 'content/events/20260323/media/cover.jpg', color: '#1e40af', text: 'Event 2 Cover' },
    { path: 'content/events/20251002/media/cover.jpg', color: '#db2777', text: 'Event 1 Cover' }
];

images.forEach(img => {
    // Saving as .svg even if extension is .jpg/.png for web browser compatibility in dev, 
    // keeping the requested path extension to match JSON data.
    // Modern browsers render SVG content in img tags regardless of extension usually, 
    // or I can just save real JPGs but that requires a library. 
    // To be safe/simple, I'll rename them in JSON or just rely on browser MIME type sniffing (which might fail) 
    // OR just create SVGs and update the JSONs?
    // Updating JSONs is cleaner.

    const svgContent = createSvg(400, 400, img.color, img.text);
    // Change extension to .svg
    const svgPath = img.path.replace(/\.(jpg|png)$/, '.svg');
    fs.writeFileSync(svgPath, svgContent);
    console.log(`Created ${svgPath}`);
});
