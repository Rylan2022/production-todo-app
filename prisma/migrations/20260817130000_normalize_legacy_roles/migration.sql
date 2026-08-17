-- Normalize roles written by the legacy authentication flow.
UPDATE "User"
SET "role" = 'ADMIN'
WHERE "role" = 'admin';
