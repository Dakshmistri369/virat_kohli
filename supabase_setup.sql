-- SUPABASE SQL SETUP SCRIPT
-- Copy and paste this script into the Supabase SQL Editor to initialize tables.

-- 1. Create records table
CREATE TABLE IF NOT EXISTS records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    format TEXT UNIQUE NOT NULL,
    matches INTEGER NOT NULL,
    innings INTEGER NOT NULL,
    runs INTEGER NOT NULL,
    average NUMERIC(6, 2) NOT NULL,
    strike_rate NUMERIC(6, 2) NOT NULL,
    highest_score TEXT NOT NULL,
    centuries INTEGER DEFAULT 0,
    half_centuries INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    double_centuries INTEGER DEFAULT 0,
    wickets INTEGER DEFAULT 0,
    catches INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public reads
CREATE POLICY "Allow public read access on records" 
ON records FOR SELECT 
TO public 
USING (true);

-- Create policy to allow service role full access (for seeding)
CREATE POLICY "Allow service_role full access on records" 
ON records FOR ALL 
TO service_role 
USING (true);


-- 2. Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public reads
CREATE POLICY "Allow public read access on gallery" 
ON gallery FOR SELECT 
TO public 
USING (true);

-- Create policy to allow service role full access (for seeding)
CREATE POLICY "Allow service_role full access on gallery" 
ON gallery FOR ALL 
TO service_role 
USING (true);
