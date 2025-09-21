-- Remove soft delete fields from notifications table
-- This migration removes soft delete functionality from notifications
-- since we use hard delete with scheduled cleanup

-- Remove soft delete columns
ALTER TABLE notifications
DROP COLUMN IF EXISTS is_deleted,
DROP COLUMN IF EXISTS deleted_at,
DROP COLUMN IF EXISTS deleted_by;

-- Drop indexes related to soft delete fields on notifications table
DROP INDEX IF EXISTS idx_notifications_is_deleted;
DROP INDEX IF EXISTS idx_notifications_deleted_at;

-- Add created_at and modified_at columns if they don't exist
-- (These should already exist from the initial table creation)
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP;

-- Update existing records to have proper timestamps
UPDATE notifications 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

UPDATE notifications 
SET modified_at = CURRENT_TIMESTAMP 
WHERE modified_at IS NULL;

-- Make created_at NOT NULL after updating existing records
ALTER TABLE notifications 
ALTER COLUMN created_at SET NOT NULL;
