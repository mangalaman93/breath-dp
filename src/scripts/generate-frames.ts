const sharp = require('sharp');
const path = require('path');

async function generateFrames() {
  const publicDir = path.join(process.cwd(), 'public');

  // Frame 1: Elegant Victorian Frame
  const frame1 = Buffer.from(`
    <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <!-- Main border -->
      <rect x="20" y="20" width="760" height="760" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Decorative corners -->
      <g transform="translate(20,20)">
        <!-- Top left corner -->
        <path d="M 0,100 C 0,50 50,0 100,0" fill="none" stroke="black" stroke-width="3"/>
        <path d="M 0,80 C 0,40 40,0 80,0" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="30" cy="30" r="5" fill="black"/>
        <circle cx="60" cy="15" r="3" fill="black"/>
        <circle cx="15" cy="60" r="3" fill="black"/>
      </g>
      
      <!-- Copy the corner to other positions -->
      <g transform="translate(780,20) rotate(90)">
        <path d="M 0,100 C 0,50 50,0 100,0" fill="none" stroke="black" stroke-width="3"/>
        <path d="M 0,80 C 0,40 40,0 80,0" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="30" cy="30" r="5" fill="black"/>
        <circle cx="60" cy="15" r="3" fill="black"/>
        <circle cx="15" cy="60" r="3" fill="black"/>
      </g>
      
      <g transform="translate(780,780) rotate(180)">
        <path d="M 0,100 C 0,50 50,0 100,0" fill="none" stroke="black" stroke-width="3"/>
        <path d="M 0,80 C 0,40 40,0 80,0" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="30" cy="30" r="5" fill="black"/>
        <circle cx="60" cy="15" r="3" fill="black"/>
        <circle cx="15" cy="60" r="3" fill="black"/>
      </g>
      
      <g transform="translate(20,780) rotate(270)">
        <path d="M 0,100 C 0,50 50,0 100,0" fill="none" stroke="black" stroke-width="3"/>
        <path d="M 0,80 C 0,40 40,0 80,0" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="30" cy="30" r="5" fill="black"/>
        <circle cx="60" cy="15" r="3" fill="black"/>
        <circle cx="15" cy="60" r="3" fill="black"/>
      </g>
      
      <!-- Decorative middle elements -->
      <g id="middle-decoration">
        <rect x="350" y="20" width="100" height="2" fill="black"/>
        <circle cx="400" cy="21" r="4" fill="black"/>
      </g>
      
      <use href="#middle-decoration" transform="rotate(90 400 400)"/>
      <use href="#middle-decoration" transform="rotate(180 400 400)"/>
      <use href="#middle-decoration" transform="rotate(270 400 400)"/>
    </svg>
  `);

  // Frame 2: Art Nouveau Style Frame
  const frame2 = Buffer.from(`
    <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <!-- Main border -->
      <rect x="40" y="40" width="720" height="720" fill="none" stroke="black" stroke-width="3"/>
      
      <!-- Decorative swirls -->
      <g id="corner-swirl">
        <path d="M 0,120 C 0,60 60,0 120,0 
                 M 0,100 C 0,50 50,0 100,0
                 M 20,80 C 20,40 40,20 80,20
                 M 40,60 C 40,30 60,40 60,40" 
              fill="none" stroke="black" stroke-width="2"/>
        
        <!-- Decorative elements -->
        <circle cx="40" cy="40" r="4" fill="black"/>
        <circle cx="80" cy="20" r="3" fill="black"/>
        <circle cx="20" cy="80" r="3" fill="black"/>
        <path d="M 90,10 Q 100,0 110,10 T 130,10" fill="none" stroke="black" stroke-width="1.5"/>
      </g>
      
      <!-- Apply swirls to all corners -->
      <g transform="translate(40,40)">
        <use href="#corner-swirl"/>
      </g>
      
      <g transform="translate(760,40) rotate(90)">
        <use href="#corner-swirl"/>
      </g>
      
      <g transform="translate(760,760) rotate(180)">
        <use href="#corner-swirl"/>
      </g>
      
      <g transform="translate(40,760) rotate(270)">
        <use href="#corner-swirl"/>
      </g>
      
      <!-- Side decorations -->
      <g id="side-decoration">
        <path d="M 350,40 Q 400,60 450,40" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="400" cy="45" r="3" fill="black"/>
      </g>
      
      <use href="#side-decoration" transform="rotate(90 400 400)"/>
      <use href="#side-decoration" transform="rotate(180 400 400)"/>
      <use href="#side-decoration" transform="rotate(270 400 400)"/>
    </svg>
  `);

  await sharp(frame1).png().toFile(path.join(publicDir, 'frame1.png'));

  await sharp(frame2).png().toFile(path.join(publicDir, 'frame2.png'));
}

generateFrames().catch(console.error);
