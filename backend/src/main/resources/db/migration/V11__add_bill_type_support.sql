-- Add bill type support for hybrid personal/nex bills
ALTER TABLE bills ADD COLUMN bill_type VARCHAR(20) NOT NULL DEFAULT 'PERSONAL';
ALTER TABLE bills ALTER COLUMN nex_id DROP NOT NULL;

-- Add constraint for bill type
ALTER TABLE bills ADD CONSTRAINT chk_bill_type CHECK (bill_type IN ('PERSONAL', 'NEX'));

-- Add constraint for nex_id based on bill_type
ALTER TABLE bills ADD CONSTRAINT chk_bill_nex_consistency 
CHECK (
    (bill_type = 'PERSONAL' AND nex_id IS NULL) OR 
    (bill_type = 'NEX' AND nex_id IS NOT NULL)
);

-- Add index for bill type queries
CREATE INDEX idx_bills_bill_type ON bills(bill_type);
CREATE INDEX idx_bills_created_by_type ON bills(created_by, bill_type);
