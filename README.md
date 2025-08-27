# Final Project Frontend

This is the frontend for the Final Project, built with Next.js and TypeScript.

## Features

- User registration and login
- Booking system
- Dashboard for users and admins
- Design portfolio
- Responsive UI

## Deployment

- [Frontend Live Demo](https://dummy-frontend-deployment-url.com)

## Screenshots

| Home Page                                                                       | Dashboard                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ![Home Screenshot](https://dummyimage.com/400x200/cccccc/000000&text=Home+Page) | ![Dashboard Screenshot](https://dummyimage.com/400x200/cccccc/000000&text=Dashboard) |

---

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- pnpm (or npm/yarn)

### Installation

```bash
pnpm install
```

### Running Locally

```bash
pnpm dev
```

The app will run at `http://localhost:3001` (or as configured in `next.config.ts`).

### Environment Variables

Create a `.env.local` file in the root with:

```
NEXT_PUBLIC_API_URL=http://localhost:3000 # Backend API URL
```

Add any other variables as needed.

## Project Structure

- `src/app/` — Main app pages and routes
- `src/components/` — Reusable UI components
- `src/lib/` — API and utility functions
- `public/` — Static assets and images
- `docs/` — Documentation

## Deployment

You can deploy this frontend to Vercel, Netlify, or Railway. Set environment variables for your backend API URL and any secrets.

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT
