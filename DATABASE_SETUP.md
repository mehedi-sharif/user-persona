# Customer Persona Database Setup

## Overview
This document explains how to set up the Supabase database for storing customer persona data.

## Database Structure

The `customers` table stores additional persona data for users from your API. It uses `api_user_id` to reference users from the SitePins API.

### Fields

#### Core Fields (from API)
- `api_user_id` (TEXT, UNIQUE) - Reference to API user's `_id`
- `full_name` (TEXT) - Customer's full name
- `email` (TEXT) - Email address
- `image` (TEXT) - Profile image URL
- `country` (TEXT) - Country

#### Extended Persona Fields
- `job_title` (TEXT) - Job title
- `company` (TEXT) - Company name
- `industry` (TEXT) - Industry
- `linkedin_profile` (TEXT) - LinkedIn profile URL
- `phone` (TEXT) - Phone number
- `website` (TEXT) - Personal or company website
- `bio` (TEXT) - Short bio or description

#### Research Data
- `raw_notes` (TEXT) - Raw research notes, interview transcripts
- `pain_points` (TEXT[]) - Array of customer pain points
- `goals` (TEXT[]) - Array of customer goals
- `persona_summary` (TEXT) - AI-generated persona summary

#### Timestamps
- `created_at` (TIMESTAMP) - Record creation time
- `updated_at` (TIMESTAMP) - Last update time (auto-updated)
- `last_researched` (TIMESTAMP) - Last research session date

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration files in order:
   - First: `supabase/migrations/20231027000000_create_customers_table.sql`
   - Then: `supabase/migrations/20250129000000_update_customers_table.sql`

### Option 2: Using Supabase CLI

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Push migrations to database
supabase db push
```

## How It Works

### Data Flow

1. **API Data**: Customers are fetched from the SitePins API
2. **Persona Data**: Additional persona data is stored in Supabase
3. **Merge**: When editing, the app merges API data with Supabase persona data

### Edit Flow

1. User clicks "Edit Persona" on a customer
2. App fetches customer from API
3. App checks Supabase for existing persona data using `api_user_id`
4. Data is merged and displayed in the form
5. On save, data is upserted to Supabase (insert if new, update if exists)

### Key Features

- **Flexible Schema**: Easy to add more fields in the future
- **API Integration**: Seamlessly works with external API data
- **No Duplication**: Uses `api_user_id` to link records
- **Auto Timestamps**: `updated_at` automatically updates on changes

## Adding New Fields

To add new fields in the future:

1. Create a new migration file:
```sql
-- supabase/migrations/YYYYMMDD_add_new_field.sql
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS new_field_name TEXT;
```

2. Update the TypeScript type in `src/types/customer.ts`:
```typescript
export type Customer = {
  // ... existing fields
  new_field_name?: string
}
```

3. Add the field to the form in `src/components/customer-form.tsx`

## Environment Variables

Make sure these are set in your `.env.local` and Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_PINS_API_BASE_URL=https://api.sitepins.com/api/v1
NEXT_PUBLIC_SITE_PINS_API_TOKEN=your_api_token
```

## Testing

1. Navigate to `/customers`
2. Click "Edit Persona" on any customer
3. Fill in the persona fields (LinkedIn, Company, etc.)
4. Click "Save Changes"
5. Data should be stored in Supabase
6. Refresh the page - your data should persist

## Troubleshooting

### Migration Errors
- Check that you're running migrations in order
- Verify Supabase connection
- Check SQL Editor for error messages

### Form Not Saving
- Check browser console for errors
- Verify Supabase environment variables
- Check Row Level Security policies

### Data Not Showing
- Verify API credentials are set in Vercel
- Check that `api_user_id` matches between API and Supabase
- Check browser network tab for API errors
