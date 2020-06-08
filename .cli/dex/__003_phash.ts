import dex from '../../.data/dex_customized.json'
import Jimp from 'jimp'
import { promises as fs } from 'fs'
const ImagePHash = require('@jimp/core/es/modules/phash')

async function run() {
  const pHash = new ImagePHash()
  const data = await Promise.all(
    dex.map(async ({ slug }) => {
      const img = (await Jimp.read(__dirname+`/../../.data/cropped/${slug}.png`)).autocrop()
      return {
        slug,
        w: img.getWidth(),
        h: img.getHeight(),
        hash: (img as any).pHash()
      }
    })
  )

  await fs.writeFile(
    './src/analyzer/config/v2_hash.ts',
    `export default ${JSON.stringify(data, null, 2)}`
  )
}

run()
