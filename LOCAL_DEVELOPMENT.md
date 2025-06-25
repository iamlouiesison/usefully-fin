# Local Development Setup

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Or create `.env.local` manually with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

3. **Get your Supabase credentials**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy the Project URL and anon key
   - Copy the service_role key (for seeding)

4. **Update .env.local** with your actual values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   ```
   http://localhost:3000
   ```

## Database Seeding (Optional)

If you want to seed your database locally:

```bash
npm run seed
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Troubleshooting

**If you get environment variable errors:**
- Make sure `.env.local` exists and has the correct values
- Restart the dev server after changing environment variables

**If database connection fails:**
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure RLS policies allow public read access

**If build fails:**
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build` 