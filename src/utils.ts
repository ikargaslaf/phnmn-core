import {createCanvas, Image, loadImage} from 'canvas';
import {ethers, BigNumber} from 'ethers';
import {toUtf8Bytes} from 'ethers/lib/utils';

const fs = require('fs');

const RARITY = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
const PARTS = [
  'body',
  'head',
  'costume',
  'jewerly',
  'custom_1',
  'custom_2',
  'custom_3',
  'custom_4',
  'custom_5',
]
const DIVISOR = [
  [3, 7, 4, 3],
  [6, 16, 15, 5],
  [3, 19, 14, 7],
  [3, 7, 4, 3],
  [3, 7, 4, 3]
]
const NUM_ATTRIBUTES = new Map([
  ['COMMON', 4],
  ['UNCOMMON', 4],
  ['RARE', 4],
  ['EPIC', 6],
  ['LEGENDARY', 1],
])

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
  fs.writeFileSync(`./public/apes/${tokenId}.png`, buf);
}

export function generateAttributes(tokenId: string, rarity: number) {
  let hash = ethers.utils.keccak256(toUtf8Bytes(tokenId));
  hash = hash.substring(2);
  const num_attributes = NUM_ATTRIBUTES.get(RARITY[rarity])
  let lastUsedIndex = 0;
  let fromHash;
  let attributes: Map<string,string> = new Map();

  for (let i = 0; i < num_attributes!; i++) {
    fromHash = extractFromHash(hash, lastUsedIndex, /[0-9a-zA-Z]/);
    lastUsedIndex = fromHash.lastUsedIndex;
    let attribute = parseInt(fromHash.extractedLetter, 36) % DIVISOR[rarity][i]

    if(PARTS[i]=='body'&& attribute==0){
      attribute = attribute + 1;
    }
    if(PARTS[i]=='head'&& attribute==0){
      attribute = attribute + 1;
    }

    attributes.set(PARTS[i], attribute.toString());
  }
  const Attributes = Object.fromEntries(attributes)
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
