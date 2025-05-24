# Mindful Breathing App

A simple tool for guided breathing exercises and relaxation that helps reduce stress and improve focus.

## Features

- Multiple breathing techniques (Box Breathing, 4-7-8 Technique, Calming Breath)
- Customizable breath duration and ratios
- Relaxing background audio options
- Light and dark themes
- Interactive water-like breathing circle

## Local Development

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies: `npm install` or `yarn`
3. Start the development server: `npm run dev` or `yarn dev`
4. Open your browser to the URL displayed in the terminal (usually http://localhost:5173/)

### Audio Files

The app includes three audio tracks in the `src/assets/audio` directory:

- `calm-meditation.mp3` - Gentle meditation music
- `gentle-ocean.mp3` - Ocean waves sounds
- `forest-ambience.mp3` - Forest ambience with birds

To use different audio files:

1. Place your audio files in the `src/assets/audio` directory
2. Update the imports in `src/components/AudioPlayer.jsx`
3. Make sure your audio files are in MP3 format for best compatibility

## Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory, which can be deployed to any static hosting service.

## Technologies Used

- React
- Vite
- CSS3 with custom animations
- HTML5 Audio API
