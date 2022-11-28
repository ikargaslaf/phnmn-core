import {createCanvas, Image, loadImage} from 'canvas';
import {ethers, BigNumber} from 'ethers';
import {toUtf8Bytes} from 'ethers/lib/utils';

const fs = require('fs');

const RARITY = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
const PARTS = [
  'body',
  'hair',
  'hat',
  'costume',
  'jewerly',
  'custom_1',
  'custom_2',
  'custom_3',
  'custom_4',
  'custom_5',
]

export async function generateImage(
  tokenId: string | undefined,
  rarity: number,
  attributes: any,
) {
  const canvas = createCanvas(1200, 1200);
  const ctx = canvas.getContext('2d');

  //for background
  // await loadImage(`./public/assets/${RARITY[rarity]}.png`).then(image => {
  //   ctx.drawImage(image, 0, 0);
  //   ctx.save();
  // });

  for (const attribute in attributes) {
    if (attributes[attribute] != undefined && attributes[attribute] != 0) {
      await loadImage(
        `./public/assets/${RARITY[rarity]}/${attribute}/${attribute}_${attributes[attribute]}.png`,
      ).then(image => {
        ctx.drawImage(image, 0, 0);
        ctx.save();
      });
    }
  }

  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(`./public/${tokenId}.png`, buf);
}

export function generateAttributes(tokenId: string) {
  let hash = ethers.utils.keccak256(toUtf8Bytes(tokenId));
  hash = hash.substring(2);
  let lastUsedIndex = 0;
  let attributes: Map<string,string> = new Map();
  for (let i = 0; i < 5; i++) {
    let fromHash = extractFromHash(hash, lastUsedIndex, /[0-9]/);
    lastUsedIndex = fromHash.lastUsedIndex;
    let attribute = (+fromHash.extractedLetter % 6)
    if(PARTS[i]=='body'&& attribute==0){
      attribute = attribute + 1;
    }
    attributes.set(PARTS[i], attribute.toString());
  }
  const Attributes = Object.fromEntries(attributes)
  console.log(Attributes);
  return Attributes;
}

function extractFromHash(hash: string, lastUsedIndex: number, pattern: RegExp) {
  hash = hash.substring(lastUsedIndex, hash.length);
  let extractedLetter = '';
  let i = 0;
  for (; i < hash.length; i++) {
    if (hash.charAt(i).match(pattern)) {
      extractedLetter = hash.charAt(i);
      break;
    }
  }
  return {
    lastUsedIndex: lastUsedIndex + i + 1,
    extractedLetter: extractedLetter,
  };
}
