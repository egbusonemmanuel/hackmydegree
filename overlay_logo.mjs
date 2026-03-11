import sharp from 'sharp';
import path from 'path';

const flyerPath = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\29f9469d-e70f-4b02-98f0-d4bde1c5a8d7\\fut_minna_flyer_draft_1_1772760316256.png';
const logoPath = 'c:\\Users\\PC\\Downloads\\files\\hackmydegree\\public\\logo512.png';
const outputPath = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\29f9469d-e70f-4b02-98f0-d4bde1c5a8d7\\fut_minna_hackmydegree_flyer_final.png';

async function overlayLogo() {
    try {
        const flyerMetadata = await sharp(flyerPath).metadata();

        // Resize logo to fit nicely (e.g., 12% of flyer width)
        const logoWidth = Math.round(flyerMetadata.width * 0.12);
        const resizedLogo = await sharp(logoPath)
            .resize({ width: logoWidth })
            .toBuffer();

        // Create a sleeker, smaller banner at the bottom
        const bannerHeight = 120;
        const svgText = `
      <svg width="${flyerMetadata.width}" height="${bannerHeight}">
        <style>
          .bg { fill: rgba(0, 0, 0, 0.7); }
          .title { fill: #FFD700; font-size: 50px; font-weight: bold; font-family: 'Helvetica', sans-serif; }
          .subtitle { fill: #FFFFFF; font-size: 22px; font-family: 'Helvetica', sans-serif; }
        </style>
        <rect x="0" y="0" width="100%" height="100%" class="bg" />
        <text x="50%" y="45%" text-anchor="middle" class="title">HACK MY DEGREE</text>
        <text x="50%" y="80%" text-anchor="middle" class="subtitle">Your Academic Excellence Partner</text>
      </svg>`;

        await sharp(flyerPath)
            .composite([
                {
                    input: resizedLogo,
                    top: 30,
                    left: 30,
                },
                {
                    input: Buffer.from(svgText),
                    top: flyerMetadata.height - bannerHeight, // Fixed at bottom
                    left: 0,
                },
            ])
            .toFile(outputPath);

        console.log('Refined flyer generated successfully at:', outputPath);
    } catch (error) {
        console.error('Error refining flyer:', error);
    }
}

overlayLogo();
