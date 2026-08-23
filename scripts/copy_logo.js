import fs from 'fs';
import path from 'path';

const srcLogo = '/Users/finessejones1/.gemini/antigravity/brain/e94cbd2b-65ea-4029-afe3-d95570455e3e/arise_productions_logo_1787527632558.jpg';
const dest1 = path.resolve('frontend/public/arise_productions_logo.jpg');
const dest2 = path.resolve('frontend/public/logo.jpg');

fs.copyFileSync(srcLogo, dest1);
fs.copyFileSync(srcLogo, dest2);
console.log('✅ Arise Productions logo copied to frontend/public/!');
