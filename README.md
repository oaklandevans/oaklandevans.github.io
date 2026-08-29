# Oakland Evans - Projects & Tools

Welcome to my personal projects repository. This site hosts various tools and games, starting with **KeyType**, an interactive typing trainer.

## 🚀 KeyType

KeyType is a modern typing trainer designed to help you improve your typing speed and accuracy.

### Features
- **Real-time Feedback**: Get instant visual feedback on correct and incorrect keystrokes.
- **On-screen Keyboard**: A dynamic keyboard that highlights the next key to press.
- **Finger Positioning**: Visual guides to help you use the correct fingers for each key.
- **WPM Calculation**: Accurate Words Per Minute (WPM) tracking after each session.
- **Minimalist Interface**: Focused environment to minimize distractions.

## 🪨 Asteroids

A faithful clone of the 1979 arcade classic — rotate and thrust your ship with frictionless inertial physics, blast asteroids that split into smaller pieces, dodge (or destroy) large and small UFO saucers, and make an emergency hyperspace jump when things get hairy. Rendered as classic white-on-black vector graphics.

### Features
- **Authentic Physics**: No speed cap, no drag — momentum persists exactly like the original cabinet.
- **Asteroid Splitting**: Large asteroids break into mediums, mediums into smalls, each worth more points.
- **Flying Saucers**: Large saucers fire randomly; small saucers aim at you with limited accuracy.
- **Hyperspace**: Panic-teleport across the field, with a small risk of not surviving the jump.
- **Waves, Lives & Extra Lives**: Clear the field to advance waves; earn a bonus life every 10,000 points.

## 🛠️ Technologies Used
- **React**: Frontend framework for building the user interface.
- **Vite**: Modern build tool for fast development and optimized production builds.
- **React Router**: For seamless navigation between different projects.
- **CSS3**: Custom styling for a clean and responsive design.

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/oaklandevans/oaklandevans.github.io.git
   cd oaklandevans.github.io
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the local development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production Build
Build the project for production:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Testing
Run the unit test suite (Vitest + React Testing Library):
```bash
npm test
```
Or watch mode while developing:
```bash
npm run test:watch
```

## 🚢 Deployment

This project is automatically deployed to [GitHub Pages](https://oaklandevans.github.io) via GitHub Actions whenever changes are pushed to the `main` branch.

## 📂 Project Structure
- `src/components/`: Reusable React components (e.g., Keyboard).
- `src/pages/`: Main page components (Home, KeyType, MarioOnline, Asteroids, About).
- `src/game/`: Mario Online's game engine (model/view/controller + sprites).
- `src/asteroids/`: Asteroids' game engine (`engine/`), canvas renderer (`render/`), and input mapping (`input/`) — deterministic and unit-tested independently of React/canvas.
- `src/styles/`: CSS files for styling.
- `src/utils/`: Utility functions and data (e.g., key mappings, text paragraphs).
- `public/`: Static assets.

## 📄 License
This project is licensed under the ISC License.
