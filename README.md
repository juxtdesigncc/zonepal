# ZonePal

A timezone converter for remote teams with card and grid views.

## Features

- Convert and compare times across different time zones
- Card view for detailed timezone information
- Grid view for visual time comparison
- Blocked hours visualization
- Keyboard shortcuts for quick actions
- Supabase integration for user authentication and data storage

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for local Supabase development

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/zonepal.git
   cd zonepal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Setting up Supabase locally

1. Install Docker Desktop from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. Start Docker Desktop

3. Start Supabase locally:
   ```bash
   npx supabase start
   ```

4. This will provide you with local URLs and keys. Update your `.env.local` file with these values.

5. The database schema is defined in `supabase/schema.sql` and will be applied automatically when you start Supabase.

### Keyboard Shortcuts

- `E` - Toggle edit mode (in card view)
- `S` - Sort timezones by offset
- `R` - Reset to current time
- `K` - Open timezone search

## Database Schema

The Supabase database includes the following tables:

- `profiles` - User profile information
- `timezone_configs` - Saved timezone configurations
- `user_preferences` - User preferences for the application

## Authentication

The application uses Supabase Auth for user authentication, supporting:

- Email/password authentication
- Magic link authentication
- Social authentication (can be configured)

## Deployment

For production deployment, create a Supabase project at [https://supabase.com](https://supabase.com) and update your environment variables with the production credentials.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
