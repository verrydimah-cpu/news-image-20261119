// news-image-20261119 entry (Node 22, standard library only).
//
// The entry is a single image: entry.png, kept beside this file in the
// repo. Running the program copies that image into the output directory
// as entry.png — byte for byte, so every run yields the identical file.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
copyFileSync(new URL('./entry.png', import.meta.url), join(outputDir, 'entry.png'));

console.log(`wrote ${join(outputDir, 'entry.png')}`);
