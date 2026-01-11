
# GenX — Premium Scroll-Driven Landing Page

<div>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**Production-ready scroll-driven storytelling using image sequence animation**

[Live Demo](https://genx-v1.vercel.app/) · [Source Code](https://github.com/sagarparmarr/genx)

</div>

### 🎬 In Action

Smooth scroll-controlled 192-frame WebP sequence (headphones reveal) — inspired by premium product pages like Apple.

Here are a few demo glimpses:

## ✨ Core Features

- 192-frame **scroll-driven canvas animation** (bidirectional scrubbing)
- Butter-smooth **20% lerp + Framer Motion spring** physics
- **Responsive contain-fit** rendering with DPR clamping (max 2×)
- **CDN-ready** (CloudFront / any) with preconnect hints
- **Zero React re-renders** during animation (ref-based)
- Dark mode design with seamless background blending

## Why Image Sequence instead of Video?

| Aspect              | Image Sequence          | Video                     |
|---------------------|--------------------------|---------------------------|
| Scroll control      | Frame-perfect            | Limited / laggy seeking   |
| File size (typical) | ~3–5 MB (WebP)           | 8–20+ MB                  |
| Mobile performance  | Excellent                | Autoplay & codec issues   |
| Customization       | Full frame control       | Difficult                 |

## Quick Start

```bash
git clone https://github.com/sagarparmarr/genx.git
cd genx

# Use pnpm / npm / yarn
pnpm install
pnpm dev
```

Open http://localhost:3000

## Project Structure Highlights

```text
├── app/                  # App Router + pages
├── components/           # Canvas + animation logic
├── lib/
│   └── config.ts         # All settings in one place (CDN, frames, lerp…)
├── public/sequence/      # gitignored – local dev frames
└── .env.*                # NEXT_PUBLIC_CDN_BASE=...
```

## Production Setup (CDN)

1. Upload frames to CDN/S3 (WebP recommended)
2. Set env var:
   ```bash
   NEXT_PUBLIC_CDN_BASE=https://your-cdn-domain/sequence/
   ```
3. Deploy (Vercel/Netlify/etc.)

Preconnect + CORS are already handled in the template.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- HTML5 Canvas (GPU accelerated)

## 📄 License
This project is licensed under the MIT License.

---

Built with ❤️ by [Sagar](https://github.com/sagarparmarr)  
Give it a ⭐ if you find it useful!
