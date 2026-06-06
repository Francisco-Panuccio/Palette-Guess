# Palette Guess

Palette Guess is a bilingual color-based guessing game built with Angular. Players test their visual memory by identifying characters, countries, brands, and individual colors from carefully selected palettes.

## Live Demo

[Play Palette Guess on GitHub Pages](https://francisco-panuccio.github.io/Palette-Guess/)

## Game Modes

### Characters

Guess a character, country, or brand using its three-color palette.

- Selectable categories with dedicated JSON datasets
- Progressive hints
- Automatic answer validation
- Spanish and English names and hints
- Session-based history to avoid repeated answers
- Responsive keyboard behavior for desktop and mobile

### Chromatic

Reproduce a randomly generated target color by adjusting:

- Hue
- Saturation
- Brightness

The result includes an accuracy percentage based on the distance between both colors.

### Challenge

A combined challenge mode is planned for a future release.

## Features

- Spanish and English translations with session persistence
- Responsive design for desktop and mobile
- Custom loading animation and image preloading
- Mobile-friendly input and viewport handling
- Lazy-loaded game mode routes
- Custom error page
- GitHub Pages deployment through the `docs` directory

## Technology

- Angular 19
- TypeScript
- HTML and CSS
- Angular Router
- Signals and computed state
- JSON datasets stored in `public/data`

## Project Structure

```text
public/
  data/                 Game datasets
  fonts/                Custom fonts
  icons/                Interface icons
  images/               Visual assets
src/app/
  data/                 Application data configuration
  pages/                Home, game modes, loading, and error pages
  services/             Translation and image preload services
docs/                   GitHub Pages production build
```

## Local Development

Requirements:

- Node.js
- npm
- Angular CLI 19

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start
```

Open `http://localhost:4200/`.

## Available Scripts

```bash
npm run start
```

Starts the Angular development server.

```bash
npm run build
```

Creates a production build in `dist/palette-guess`.

```bash
npm run build:ghpages
```

Creates the GitHub Pages build in `docs`, copies the fallback `404.html`, and creates `.nojekyll`.

```bash
npm run test
```

Runs the unit tests with Karma.

## Deployment

GitHub Pages serves the contents of the `docs` directory. Before publishing changes:

```bash
npm run build:ghpages
git add -A
git commit -m "Your commit message"
git push origin main
```

## Author

Developed by [Francisco Panuccio](https://github.com/Francisco-Panuccio).
