import sharp from 'sharp';

const files = [
  { name: 'stroy-contract', src: 'C:/Users/proje/.gemini/antigravity/brain/067dca09-ef33-471c-a466-34b07cd0ca63/.user_uploaded/media_1790331431858.png' },
  { name: 'dar-group', src: 'C:/Users/proje/.gemini/antigravity/brain/067dca09-ef33-471c-a466-34b07cd0ca63/.user_uploaded/media_1790331431867.png' },
  { name: 'orbix-portal', src: 'C:/Users/proje/.gemini/antigravity/brain/067dca09-ef33-471c-a466-34b07cd0ca63/.user_uploaded/media_1790331431872.png' },
  { name: 'nova-club', src: 'C:/Users/proje/.gemini/antigravity/brain/067dca09-ef33-471c-a466-34b07cd0ca63/.user_uploaded/media_1790331431878.png' },
  { name: 'digitbiz', src: 'C:/Users/proje/.gemini/antigravity/brain/067dca09-ef33-471c-a466-34b07cd0ca63/.user_uploaded/media_1790331431881.png' },
];

async function run() {
  for (const f of files) {
    const img = sharp(f.src);
    const meta = await img.metadata();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    
    // get top-left pixel color
    const tlR = data[0], tlG = data[1], tlB = data[2];
    // get top-right pixel
    const trIdx = (info.width - 1) * info.channels;
    const trR = data[trIdx], trG = data[trIdx + 1], trB = data[trIdx + 2];
    // get bottom-left pixel
    const blIdx = (info.height - 1) * info.width * info.channels;
    const blR = data[blIdx], blG = data[blIdx + 1], blB = data[blIdx + 2];

    const toHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    
    console.log(f.name, meta.width + 'x' + meta.height, 'TL:', toHex(tlR, tlG, tlB), 'TR:', toHex(trR, trG, trB), 'BL:', toHex(blR, blG, blB));

    await sharp(f.src).webp({ quality: 96, effort: 6 }).toFile(`public/assets/project-${f.name}.webp`);
    await sharp(f.src).png({ compressionLevel: 8 }).toFile(`public/assets/project-${f.name}.png`);
  }
}

run();
