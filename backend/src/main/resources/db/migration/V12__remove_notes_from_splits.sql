-- ========================================
-- REMOVE NOTES FROM SPLITS
-- ========================================
-- Remove notes column from splits table as it's not needed
-- Splits are now simplified based on split type:
-- - PERCENTAGE: only userId and percentage
-- - AMOUNT: only userId and amount  
-- - EQUALLY: only userId

ALTER TABLE splits DROP COLUMN notes;
