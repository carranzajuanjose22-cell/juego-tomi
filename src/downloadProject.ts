import { strToU8, zipSync } from 'fflate'

import gitignoreSource from '../.gitignore?raw'
import miseSource from '../.mise.toml?raw'
import siteConfigSource from '../.figma/make/site.json?raw'
import indexHtmlSource from '../index.html?raw'
import packageSource from '../package.json?raw'
import lockfileSource from '../pnpm-lock.yaml?raw'
import tsconfigSource from '../tsconfig.json?raw'
import viteConfigSource from '../vite.config.ts?raw'
import appSource from './App.tsx?raw'
import downloaderSource from './downloadProject.ts?raw'
import indexCssSource from './index.css?raw'
import mainSource from './main.tsx?raw'
import viteEnvSource from './vite-env.d.ts?raw'
import ref2Url from './assets/ref2.png'
import referenceUrl from './assets/reference.png'
import imageOneUrl from './imports/image-1.png'
import imageUrl from './imports/image.png'

const textFiles: Record<string, string> = {
  '.gitignore': gitignoreSource,
  '.mise.toml': miseSource,
  '.figma/make/site.json': siteConfigSource,
  'index.html': indexHtmlSource,
  'package.json': packageSource,
  'pnpm-lock.yaml': lockfileSource,
  'tsconfig.json': tsconfigSource,
  'vite.config.ts': viteConfigSource,
  'src/App.tsx': appSource,
  'src/downloadProject.ts': '',
  'src/index.css': indexCssSource,
  'src/main.tsx': mainSource,
  'src/vite-env.d.ts': viteEnvSource,
}

const binaryFiles: Record<string, string> = {
  'src/assets/ref2.png': ref2Url,
  'src/assets/reference.png': referenceUrl,
  'src/imports/image-1.png': imageOneUrl,
  'src/imports/image.png': imageUrl,
}

const readme = `# Tlachtli / Ullamaliztli

Proyecto exportado desde Figma Make.

## Ejecutar localmente

1. Instala Node.js 24 y pnpm.
2. Ejecuta \`pnpm install\`.
3. Ejecuta \`pnpm dev\`.
4. Abre la URL que muestra Vite.
`

async function fetchBinary(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`No se pudo incluir el recurso ${url}`)
  return new Uint8Array(await response.arrayBuffer())
}

export async function downloadProjectArchive() {
  const archiveFiles: Record<string, Uint8Array> = {}

  for (const [path, contents] of Object.entries(textFiles)) {
    archiveFiles[path] = strToU8(
      path === 'src/downloadProject.ts' ? downloaderSource : contents,
    )
  }
  archiveFiles['README.md'] = strToU8(readme)

  await Promise.all(
    Object.entries(binaryFiles).map(async ([path, url]) => {
      archiveFiles[path] = await fetchBinary(url)
    }),
  )

  const archive = zipSync(archiveFiles, { level: 6 })
  const blob = new Blob([archive], { type: 'application/zip' })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = 'tlachtli-source.zip'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(downloadUrl)
}
