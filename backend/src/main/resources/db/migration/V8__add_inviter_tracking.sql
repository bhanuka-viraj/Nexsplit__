-- Add inviter tracking to nex_members table
-- This migration adds the invited_by field to track who sent the invitation

-- Add invited_by column to nex_members table
ALTER TABLE nex_members 
ADD COLUMN invited_by CHAR(36);

-- Add foreign key constraint for invited_by
ALTER TABLE nex_members 
ADD CONSTRAINT fk_nex_members_invited_by 
FOREIGN KEY (invited_by) REFERENCES users(id);

-- Add index for better query performance
CREATE INDEX idx_nex_members_invited_by ON nex_members(invited_by);

-- Add index for composite queries (user + status + invited_by)
CREATE INDEX idx_nex_members_user_status_invited_by ON nex_members(user_id, status, invited_by);
