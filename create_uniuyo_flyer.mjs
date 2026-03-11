import sharp from 'sharp';
import path from 'path';

const logoPath = 'c:\\Users\\PC\\Downloads\\files\\hackmydegree\\public\\logo512.png';
const baseOutputPath = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\29f9469d-e70f-4b02-98f0-d4bde1c5a8d7\\uniuyo_base_graphic.png';
const finalOutputPath = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\29f9469d-e70f-4b02-98f0-d4bde1c5a8d7\\uniuyo_hackmydegree_flyer_final.png';

async function createUniUyoFlyer() {
    const width = 1000;
    const height = 1414; // A4 aspect ratio

    // 1. Create a beautiful green gradient background SVG
    const svgBackground = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#004d26;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#006633;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
      
      <!-- Decorative circles -->
      <circle cx="900" cy="100" r="200" fill="rgba(255,255,255,0.05)" />
      <circle cx="100" cy="1300" r="300" fill="rgba(255,255,255,0.05)" />

      <!-- University Name -->
      <text x="50%" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">UNIVERSITY OF UYO</text>
      
      <!-- Motto -->
      <text x="50%" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-style="italic" fill="#FFD700">Unity, Learning and Service</text>

      <!-- Main Content Area -->
      <rect x="100" y="300" width="800" height="700" rx="20" fill="white" fill-opacity="0.1" stroke="white" stroke-width="2" />
      
      <text x="50%" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white">ADMISSION &amp; ACADEMIC</text>
      <text x="50%" y="620" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white">SUPPORT CENTER</text>
      
      <line x1="200" y1="680" x2="800" y2="680" stroke="#C0392B" stroke-width="5" />
      
      <text x="50%" y="800" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" fill="#f0f0f0">Excellence in Education and Research</text>
    </svg>
  `;

    // 2. Overlay "Hack My Degree" branding on top
    const bannerHeight = 150;
    const svgBranding = `
    <svg width="${width}" height="${bannerHeight}">
      <style>
        .bg { fill: rgba(0, 0, 0, 0.85); }
        .title { fill: #FFD700; font-size: 55px; font-weight: 900; font-family: 'Arial Black', sans-serif; }
        .subtitle { fill: #FFFFFF; font-size: 24px; font-family: sans-serif; }
      </style>
      <rect x="0" y="0" width="100%" height="100%" class="bg" />
      <text x="50%" y="45%" text-anchor="middle" class="title">HACK MY DEGREE</text>
      <text x="50%" y="80%" text-anchor="middle" class="subtitle">Your Gateway to Academic Success</text>
    </svg>
  `;

    try {
        // Generate the base image from SVG
        await sharp(Buffer.from(svgBackground))
            .toFile(baseOutputPath);

        // Composite the logo and branding
        const logoMetadata = await sharp(logoPath).metadata();
        const logoWidth = Math.round(width * 0.15);
        const resizedLogo = await sharp(logoPath).resize({ width: logoWidth }).toBuffer();

        await sharp(baseOutputPath)
            .composite([
                {
                    input: resizedLogo,
                    top: 40,
                    left: 40,
                },
                {
                    input: Buffer.from(svgBranding),
                    top: height - bannerHeight,
                    left: 0,
                }
            ])
            .toFile(finalOutputPath);

        console.log('University of Uyo flyer generated successfully at:', finalOutputPath);
    } catch (error) {
        console.error('Error creating flyer:', error);
    }
}

createUniUyoFlyer();
