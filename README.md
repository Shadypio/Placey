# ReactPlaces

A React application for sharing and discovering places with Google Maps integration.

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd ReactPlaces/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment Configuration:
   - Copy `.env.example` to `.env`
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
   - Replace `your_google_maps_api_key_here` with your actual API key in the `.env` file

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

This project requires the following environment variables:

- `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps JavaScript API key

**Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

## Google Maps API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Maps JavaScript API
4. Create credentials (API key)
5. Optionally, restrict the API key to your domain for security

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
