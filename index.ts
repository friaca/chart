import { join } from 'path'
import { parseArgs } from 'util';
import { getTopAlbums } from './lastfm';
import sharp from 'sharp';


async function main(gridSize: number, period: string, username: string, output: string, captions: boolean = false) {
  const gridEntryNumber = gridSize * gridSize;

  const response = await getTopAlbums(username, period, gridEntryNumber);
  const albumCovers = response.topalbums.album
    .map(album => album.image.filter(image => image.size == 'extralarge')[0]['#text'])

  generateChart(albumCovers, output)
}

async function generateChart(albumCoverUrls: string[], output: string) {
  const quantity = albumCoverUrls.length;
  const gridSize = Math.sqrt(quantity);
  const albumCoverSize = 300;
  const height = gridSize * albumCoverSize;
  const width = height;
  const date = getDateAsString();

  let buffers: ArrayBuffer[] = [];

  for (const url of albumCoverUrls) {
    const response = await fetch(url);
    const ab = await response.arrayBuffer();

    buffers.push(ab);
  }

  // @ts-ignore
  const compositeImages: sharp.OverlayOptions[] = buffers.map((buffer, index) => ({
    input: buffer,
    left: (index % gridSize) * albumCoverSize,
    top: Math.floor(index / gridSize) * albumCoverSize
  }));

  const fileName = join(output, `chart_${date}.jpg`);

  await sharp({
    // @ts-ignore
    create: { 
      width: width, 
      height: height, 
      channels: 3, 
      background: { r: 255, g: 255, b: 255 }, 
    }
  })
  .composite(compositeImages)
  .toFile(fileName)
}

function getDateAsString(): string {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
}

// ==================== // ====================

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    username: {
      type: 'string',
    },
    gridSize: {
      type: 'string',
    },
    period: {
      type: 'string',
    },
    output: {
      type: 'string'
    }
  },
  strict: true,
  allowPositionals: true,
});

const { gridSize, period, username, output } = values;

const parsedGridSize = +(gridSize || 0)

if (!parsedGridSize) {
  console.error('Invalid grid size!');
  process.exit(1);
}

const parsedPeriod = period ?? "";
const allowedPeriods = ['7day', '1month', '3month', '6month', '12month', 'overall']

if (!parsedPeriod || !allowedPeriods.includes(parsedPeriod)) {
  console.error(`Invalid period! The allowed values are ${allowedPeriods.join(', ')}`);
  process.exit(1);
}

const parsedUsername = username ?? "";

if (!parsedUsername) {
  console.error('Invalid username!');
  process.exit(1);
}

const parsedOutput = output ?? "."

await main(parsedGridSize, parsedPeriod, parsedUsername, parsedOutput)