-- ========================================
-- ADD EXPENSE DATE COLUMN
-- ========================================
-- Add expense_date column to expenses table to track when the expense actually occurred
-- This is different from created_at which tracks when the record was created in the system

ALTER TABLE expenses ADD COLUMN expense_date TIMESTAMP;

-- Update existing expenses to have expense_date = created_at for backward compatibility
UPDATE expenses SET expense_date = created_at WHERE expense_date IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE expenses ALTER COLUMN expense_date SET NOT NULL;
