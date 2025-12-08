# Frontend Environment Variables Template

Create a `.env.local` file in the frontend directory with the following content:

```env
# API Configuration
# Base URL for the backend API
# Development: http://localhost:4000
# Production: https://api.yourdomain.com
# Default: http://localhost:4000
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"

# Application Configuration
# Application name (optional)
NEXT_PUBLIC_APP_NAME="Hive"
```

## Setup Instructions

1. Copy the content above
2. Create a file named `.env.local` in `/frontend/` directory
3. Paste the content and adjust values as needed
4. Restart the Next.js development server

## Notes

- All frontend environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- `.env.local` is gitignored and won't be committed to version control
- If `NEXT_PUBLIC_API_BASE_URL` is not set, it defaults to `http://localhost:4000`
