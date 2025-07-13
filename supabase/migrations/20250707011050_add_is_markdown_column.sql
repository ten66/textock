/*
  # Add is_markdown Column to Templates Table

  This migration adds support for markdown formatting in templates by adding
  an `is_markdown` column to the existing `templates` table.

  Changes:
  - Add `is_markdown` column (boolean, defaults to false)
  - This allows templates to be flagged as markdown content
  - Existing templates will default to false (plain text)
*/

-- Add is_markdown column to templates table
ALTER TABLE templates 
ADD COLUMN is_markdown boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN templates.is_markdown IS 'Indicates if the template content is formatted as markdown';