# HomeFax Policy Generator - Supabase Integration

This enhanced version of the policy generator integrates with Supabase to store policy data and documents.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   cp env.example .env
   # Edit .env and add your Supabase anon key
   ```

3. **Get Supabase Keys**
   - Project URL: `https://tbqneigukeehyvhvaddw.supabase.co`
   - Get your anon key from the Supabase dashboard

## Usage

```bash
python generate_policies_supabase.py
```

## What It Does

### Database Schema
- **`policyholders` table** - normalized policyholder data with JSONB for addresses
- **`policies` table** - policy data with JSONB columns and FK to policyholders
- **Foreign key relationship** - one policyholder can have multiple policies
- **Indexes** for fast querying and full-text search
- **Helper functions** for common queries and relationships
- **Views** for simplified joined access

### Storage
- **`homefax-documents` bucket** for PDF files
- **Organized folders**: `declarations/`, `booklets/`
- **Automatic upload** of generated PDFs

### Generated Data
- **30 policies** across 3 states (TN, TX, CA)
- **24 unique policyholders** 
- **Realistic coverage data** with state-specific variations
- **PDF documents** for each policy
- **State booklets** with comprehensive policy language

## Database Structure

### Policyholders Table
- **Core identifiers**: holder_id, UUID primary key
- **Personal info**: first_name, last_name, date_of_birth, email, phone
- **Mailing address**: flexible JSONB structure
- **Timestamps**: created_at, updated_at

### Policies Table (with FK to policyholders)
- **Core identifiers**: policy_number, carrier, status
- **Relationship**: policyholder_id (FK to policyholders.id)
- **Property details**: address, construction, year built (JSONB)
- **Coverage limits**: dwelling, liability, etc. (JSONB)
- **Endorsements**: add-on coverages (JSONB array)
- **Premium breakdown**: base, taxes, discounts (JSONB)
- **Documents**: PDF references with storage paths (JSONB)
- **State-specific data**: regulatory requirements (JSONB)

## Querying Examples

```sql
-- Find all policies in Texas
SELECT * FROM get_policies_by_state('TX');

-- Get all policies for a specific policyholder
SELECT * FROM get_policies_by_holder('H0001');

-- Search for specific policyholder
SELECT * FROM policyholders WHERE last_name = 'Smith';

-- Find high-value properties with policyholder info
SELECT p.policy_number, p.carrier, ph.first_name, ph.last_name,
       p.coverages->'dwelling'->>'limit' as dwelling_coverage
FROM policies p
JOIN policyholders ph ON p.policyholder_id = ph.id
WHERE (p.coverages->'dwelling'->>'limit')::int > 500000;

-- Get policyholder with all their policies
SELECT get_policyholder_profile('H0001');

-- Get policyholders with policy counts
SELECT * FROM get_policyholders_with_policy_count();

-- Full-text search across both tables
SELECT * FROM search_policies_full_text('water backup');

-- Use the summary view for easy access
SELECT * FROM policy_summary WHERE property_state = 'TX';
```

## AI Agent Ready

The schema is optimized for AI agent queries:
- **Full-text search** across all JSONB fields
- **Flexible structure** handles varied policy formats
- **Rich context** preserved in raw_data field
- **Semantic queries** supported via JSONB operators

## Files Generated

- **Declarations**: `declarations/YYYY/LastName_FirstName_HOME_PolicyID.pdf`
- **Booklets**: `booklets/STATE/Booklet_STATE.pdf`
- **Database records**: Complete policy data in `policies` table
