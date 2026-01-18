# Numo - Bitcoin Payments Made Simple

A modern, welcoming landing page for Numo, a Bitcoin POS application that makes accepting Bitcoin payments as easy as tap-to-pay.

## Features

- 🎨 **Beautiful Design** - Warm, welcoming colors with playful animations
- 📱 **Mobile Responsive** - Looks great on all devices
- ⚡ **Fast** - Built with Next.js 15 and optimized for performance
- 🚀 **Vercel Ready** - Deploy with a single click

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Google Fonts](https://fonts.google.com/) - Nunito & Baloo 2 fonts

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Production Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Deploy to Vercel

The easiest way to deploy this site is with [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/terminal-site)

Or deploy manually:

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and deploy

## Customization

### Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --peach: #FF9F7C;
  --mint: #7DDDC5;
  --coral: #FF7B5C;
  --teal: #2D9B8A;
  --navy: #1A2E44;
  /* ... more colors */
}
```

### Content

All content is in `src/app/page.tsx`. Update the:
- Hero headline and description
- Feature cards
- FAQ questions and answers
- Footer links

## License

MIT
