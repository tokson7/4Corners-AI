-- CRITICAL PERFORMANCE OPTIMIZATION
-- Add composite index for lightning-fast dashboard queries
-- This index optimizes: WHERE userId = X ORDER BY createdAt DESC LIMIT 5
-- Expected improvement: 10-50x faster queries on large datasets

-- Create composite index (if not exists)
CREATE INDEX IF NOT EXISTS "DesignSystem_userId_createdAt_idx" 
ON "DesignSystem" ("userId", "createdAt" DESC);

-- Analyze the table to update query planner statistics
ANALYZE "DesignSystem";

-- Verify index was created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'DesignSystem' 
AND indexname LIKE '%userId%createdAt%';
