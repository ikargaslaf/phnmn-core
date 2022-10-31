import {BigNumber} from 'ethers';
import {createCanvas, Image, loadImage} from 'canvas';
const fs = require('fs');

const RARITY = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

export async function generateImage(
  tokenId: number | undefined,
  rarity: number,
  traits: any,
) {
  const canvas = createCanvas(858, 1005);
  const ctx = canvas.getContext('2d');
  await loadImage(`./public/assets/${RARITY[rarity]}.png`).then(image => {
    ctx.drawImage(image, 0, 0);
    ctx.save();
  });

  for (const trait in traits) {
    if (traits[trait] != undefined && traits[trait] != 0) {
      await loadImage(
        `./public/assets/${RARITY[rarity]}/${trait}_g${traits[trait]}.png`,
      ).then(image => {
        ctx.drawImage(image, 0, 0);
        ctx.save();
      });
    }
  }

  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(`./public/${tokenId}.png`, buf);
}
