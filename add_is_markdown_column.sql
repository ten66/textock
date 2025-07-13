-- Add is_markdown column to templates table
-- This SQL should be run in Supabase SQL Editor

ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS is_markdown boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN templates.is_markdown IS 'Indicates if the template content is formatted as markdown';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'templates' 
AND column_name = 'is_markdown';