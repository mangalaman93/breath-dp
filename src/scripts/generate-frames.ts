const sharp = require('sharp');
const path = require('path');

async function generateFrames() {
  const publicDir = path.join(process.cwd(), 'public');

  // Create frame 1 - a simple border
  const frame1 = Buffer.from(`
    <svg width="800" height="800">
      <rect x="0" y="0" width="800" height="800" fill="none"
            stroke="black" stroke-width="20"/>
    </svg>
  `);

  await sharp(frame1)
    .png()
    .toFile(path.join(publicDir, 'frame1.png'));

  // Create frame 2 - a decorative frame
  const frame2 = Buffer.from(`
    <svg width="800" height="800">
      <rect x="20" y="20" width="760" height="760" fill="none"
            stroke="black" stroke-width="10"/>
      <rect x="0" y="0" width="800" height="800" fill="none"
            stroke="black" stroke-width="20"/>
      <path d="M 0,0 L 100,100 M 700,700 L 800,800"
            stroke="black" stroke-width="10"/>
      <path d="M 800,0 L 700,100 M 100,700 L 0,800"
            stroke="black" stroke-width="10"/>
    </svg>
  `);

  await sharp(frame2)
    .png()
    .toFile(path.join(publicDir, 'frame2.png'));
}

generateFrames().catch(console.error);
