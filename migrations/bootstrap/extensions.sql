CREATE SCHEMA IF NOT EXISTS extensions;

-- application stuff --
CREATE EXTENSION IF NOT EXISTS pg_trgm with SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS intarray with SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS earthdistance with SCHEMA extensions CASCADE;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch with SCHEMA extensions CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" with SCHEMA extensions CASCADE;

-- allow all by default
-- TODO: should be stripped as much as possible
GRANT USAGE ON SCHEMA extensions TO apiko_courses;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA extensions TO apiko_courses;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO apiko_courses;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA extensions TO apiko_courses;
GRANT ALL ON ALL SEQUENCES IN SCHEMA extensions to apiko_courses;
