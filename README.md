# Digital Masjid Screen

A modern, responsive web application designed to display prayer times, announcements, and Islamic content for mosque displays. Built with React and Material-UI, it features a responsive design that adapts to various screen sizes and orientations.

## Features

- 🕌 **Prayer Times Display**
  - Real-time prayer time updates
  - Countdown timer to next prayer
  - Hijri date conversion
  - Dynamic updates based on location

- 📱 **Responsive Design**
  - Adapts to different screen sizes and orientations
  - Dynamic text scaling for optimal readability
  - No scrolling required - fits all content on screen
  - Optimized for mosque display screens

- 📢 **Content Features**
  - Hadith of the Day display
  - Announcement banner
  - Custom content management
  - Rich text editing support

- ⚡ **Performance**
  - PWA support with offline capabilities
  - Optimized for 24/7 display operation
  - Smooth animations and transitions
  - Efficient resource management

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Components**: Material-UI (MUI) v5
- **State Management**: React Context + Hooks
- **Styling**: Emotion (CSS-in-JS)
- **Date Handling**: Moment.js with Hijri support
- **Text Editor**: TipTap
- **Animations**: Framer Motion
- **Build Tool**: Create React App

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd masjidscreen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── assets/         # Images and static assets
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── state/          # Global state management
└── utils/          # Utility functions
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_url
```

## Browser Support

- Chrome (recommended for display screens)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
