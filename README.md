# Nuxt Minimal Starter

# Greek Alphabet Learning Game

An interactive web application to help you learn the Greek alphabet by identifying each letter and typing its name.

## Features

- **Interactive Learning**: See a Greek letter and type its name
- **Streak System**: Keep track of your current streak of correct answers
- **High Score**: Your best streak is saved in browser cookies
- **Random Order**: Letters appear in random order for better learning
- **Mobile Friendly**: Responsive design that works on desktop and mobile
- **Complete Coverage**: All 24 letters of the Greek alphabet

## Greek Letters Included

The game includes all 24 letters of the Greek alphabet:
- Α (Alpha), Β (Beta), Γ (Gamma), Δ (Delta)
- Ε (Epsilon), Ζ (Zeta), Η (Eta), Θ (Theta)
- Ι (Iota), Κ (Kappa), Λ (Lambda), Μ (Mu)
- Ν (Nu), Ξ (Xi), Ο (Omicron), Π (Pi)
- Ρ (Rho), Σ (Sigma), Τ (Tau), Υ (Upsilon)
- Φ (Phi), Χ (Chi), Ψ (Psi), Ω (Omega)

## How to Play

1. Click "Start Game" to begin
2. A Greek letter will be displayed
3. Type the name of the letter (e.g., "Alpha" for Α)
4. Press Enter or click Submit
5. Continue until you make a mistake or complete all letters
6. Try to beat your high score!

## Tech Stack

- **Nuxt 4**: Vue.js framework
- **Pug**: Template engine for clean markup
- **Sass**: CSS preprocessor for styling
- **TypeScript**: For type safety

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── app/
│   └── app.vue          # Main game component
├── assets/
│   └── scss/
│       └── main.scss    # Game styles
├── nuxt.config.ts       # Nuxt configuration
└── package.json         # Dependencies and scripts
```

## Mobile App Potential

This project is built with responsive design in mind and could be converted to a mobile app using:
- **Capacitor**: For native iOS/Android apps
- **PWA**: Progressive Web App capabilities
- **Nuxt PWA module**: For offline functionality

The game's simple interface and touch-friendly design make it ideal for mobile use.

## Contributing

Feel free to contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
