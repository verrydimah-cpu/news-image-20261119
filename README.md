# The World in One Picture — Thursday 19 November 2026

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/verrydimah-cpu/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/verrydimah-cpu/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

One image that sums up the world's news of **Thursday 19 November 2026**, drawn as a 3D front page: a dusk diorama of Shenzhen Bay on the night of the summit, floating over a broadsheet of the day's other stories.

**The lead story:** a first for modern diplomacy. Trump, Xi and Putin meet face to face at the APEC summit in Shenzhen — the hero shows the lit skyline across the bay, the summit tower, and the three flags on the promenade — signing a joint "peace declaration" and promising U.N. and I.C.C. reform, with the Ukraine and Iran wars topping the agenda.

**Also on the page:**

- **Ukraine** — the Crimean Bridge is struck for the third time this week; a span partially collapses in a seven-stage strike Zelensky calls "unprecedented".
- **The Hague** — the International Court of Justice rules Myanmar committed state-sponsored genocide against the Rohingya, the world court's first ruling of its kind.
- **Iran** — the war widens: Trump warns Tehran over an alleged dirty-bomb plot, Iran fires on Kuwait, and a Houthi missile damages Riyadh's PIF Tower.
- **Gaza** — Israeli tanks push into central Gaza beyond the ceasefire line; a strike on Nasser Hospital kills six, including a surgeon.
- **Games** — GTA VI launches worldwide, with midnight queues for the most anticipated game of the decade.
- **Markets** — Anthropic raises $81.3 billion at a $1.5 trillion valuation, the largest IPO ever.

The poster itself is `poster.html` — a single self-contained file whose hero is a real-time 3D scene (Three.js/WebGL: procedural dusk bay, lit-window skyline, painted flags, motorcade lights) with a photoreal finish — PMREM sky ambience, ACES tone mapping, broken sun glint and sensor grain on the hero only, plus a final hero-only unsharp mask (`sharpen_hero.py`, OpenCV) that restores the scene's edge bite after the downscale — composited with flat typeset text and inline-SVG panel art, then rendered to `entry.png` (1024 × 1024) by `render.mjs`. No external assets, no webfonts, no network.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `entry.png` into `out/` — the whole entry is that one image, byte-identical on every run.

## Links

- Bounty: https://make.fun/bounty/news-image-20261119
- Enter make.fun with my referral link: https://make.fun/r/hz6kvzj2

## License

MIT — see [LICENSE](LICENSE).
