-- ⚠️ RESET SCRIPT: DROPS OLD TABLES TO FIX "UUID vs TEXT" ERROR
DROP TABLE IF EXISTS public.daily_prices CASCADE;
DROP TABLE IF EXISTS public.species CASCADE;
DROP TABLE IF EXISTS public.harbours CASCADE;

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Tables

-- SPECIES: Static reference data for fish types
create table if not exists public.species (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    scientific_name text,
    local_name text,
    image_url text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- HARBOURS: Locations of mandis
create table if not exists public.harbours (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    location text,
    city text,
    state text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DAILY_PRICES: The core dynamic data
create table if not exists public.daily_prices (
    id uuid default uuid_generate_v4() primary key,
    species_id uuid references public.species(id) on delete cascade,
    harbour_id uuid references public.harbours(id) on delete cascade,
    price_per_kg numeric not null,
    trend text check (trend in ('up', 'down', 'stable')),
    trend_percentage numeric default 0,
    trust_score numeric default 90, -- Mock metric for "verified" price
    stock_status text default 'available', -- available, scarce, out_of_stock
    date date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(species_id, harbour_id, date) -- Prevent duplicate entries for same day/loc/fish
);

-- 3. Enable Row Level Security (RLS)
alter table public.species enable row level security;
alter table public.harbours enable row level security;
alter table public.daily_prices enable row level security;

-- 4. Create Policies (Open Read, Admin Write)
-- Allow anyone to READ data (public app)
create policy "Allow public read access" on public.species for select using (true);
create policy "Allow public read access" on public.harbours for select using (true);
create policy "Allow public read access" on public.daily_prices for select using (true);

-- 5. SEED DATA -------------------------------------------------------------

-- Insert HARBOURS
insert into public.harbours (name, city, state) values
    ('Kochi Harbour', 'Kochi', 'Kerala'),
    ('Vizag Fishing Harbour', 'Visakhapatnam', 'Andhra Pradesh'),
    ('Mangalore Old Port', 'Mangalore', 'Karnataka'),
    ('Sassoon Dock', 'Mumbai', 'Maharashtra'),
    ('Chennai Kasimedu', 'Chennai', 'Tamil Nadu'),
    ('Veraval Harbour', 'Veraval', 'Gujarat'),
    ('Paradip Port', 'Paradip', 'Odisha');

-- Insert SPECIES (Comprehensive list from research)
insert into public.species (name, scientific_name, local_name, image_url) values
    ('Seer Fish', 'Scomberomorus commerson', 'Neymeen / Surmai', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500'),
    ('Pomfret (Black)', 'Parastromateus niger', 'Avoli / Halwa', 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=500'),
    ('Pomfret (White)', 'Pampus argenteus', 'Vella Avoli / Paplet', 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=500'),
    ('Indian Mackerel', 'Rastrelliger kanagurta', 'Ayala / Bangda', 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=500'),
    ('Sardine', 'Sardinella longiceps', 'Mathi / Chaala / Tarli', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500'),
    ('King Fish', 'Scomberomorus guttatus', 'Surmai / Vanjaram', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500'),
    ('Tiger Prawns', 'Penaeus monodon', 'Chemmeen / Jhinga', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500'),
    ('White Prawns', 'Fenneropenaeus indicus', 'Naran / Jhinga', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500'),
    ('Tuna (Yellowfin)', 'Thunnus albacares', 'Choora / Kera', 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=500'),
    ('Anchovy', 'Encrasicholina devisi', 'Netholi / Kozhuva', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500'),
    ('Mud Crab', 'Scylla serrata', 'Njandu / Kekda', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500'),
    ('Red Snapper', 'Lutjanus campechanus', 'Chempalli / Rane', 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=500'),
    ('Squid', 'Uroteuthis duvaucelii', 'Koonthal / Calamari', 'https://images.unsplash.com/photo-1560787313-5dff3307e257?w=500'),
    ('Lobster', 'Panulirus polyphagus', 'Konchu', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500'),
    ('Pearl Spot', 'Etroplus suratensis', 'Karimeen', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500'),
    ('Rohu', 'Labeo rohita', 'Rohu', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500'),
    ('Catla', 'Gibelion catla', 'Katla', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500'),
    ('Barramundi', 'Lates calcarifer', 'Kalanji / Bhetki', 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=500'),
    ('Croaker', 'Johnius belangerii', 'Kora / Dhoma', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500');

-- Insert DAILY_PRICES (Using a CTE to lookup IDs for robustness)
DO $$
DECLARE
    -- ID Variables
    h_kochi uuid; h_vizag uuid; h_mumbai uuid; h_chennai uuid; h_mangalore uuid; h_veraval uuid; h_paradip uuid;
    s_seer uuid; s_mackerel uuid; s_sardine uuid; s_prawn_t uuid; s_prawn_w uuid; s_pomfret_b uuid; s_pomfret_w uuid; s_crab uuid; s_tuna uuid; s_snapper uuid; s_squid uuid; s_lobster uuid; s_anchovy uuid; s_shark uuid; s_barracuda uuid; s_croaker uuid; s_roh uuid;
BEGIN
    -- Get Harbour IDs
    SELECT id INTO h_kochi FROM harbours WHERE name = 'Kochi Harbour';
    SELECT id INTO h_vizag FROM harbours WHERE name = 'Vizag Fishing Harbour';
    SELECT id INTO h_mumbai FROM harbours WHERE name = 'Sassoon Dock';
    SELECT id INTO h_chennai FROM harbours WHERE name = 'Chennai Kasimedu';
    SELECT id INTO h_mangalore FROM harbours WHERE name = 'Mangalore Old Port';
    SELECT id INTO h_veraval FROM harbours WHERE name = 'Veraval Harbour';
    SELECT id INTO h_paradip FROM harbours WHERE name = 'Paradip Port';

    -- Get Species IDs
    SELECT id INTO s_seer FROM species WHERE name = 'Seer Fish';
    SELECT id INTO s_mackerel FROM species WHERE name = 'Indian Mackerel';
    SELECT id INTO s_sardine FROM species WHERE name = 'Sardine';
    SELECT id INTO s_prawn_t FROM species WHERE name = 'Tiger Prawns';
    SELECT id INTO s_prawn_w FROM species WHERE name = 'White Prawns';
    SELECT id INTO s_pomfret_b FROM species WHERE name = 'Pomfret (Black)';
    SELECT id INTO s_pomfret_w FROM species WHERE name = 'Pomfret (White)';
    SELECT id INTO s_crab FROM species WHERE name = 'Mud Crab';
    SELECT id INTO s_tuna FROM species WHERE name = 'Tuna (Yellowfin)';
    SELECT id INTO s_snapper FROM species WHERE name = 'Red Snapper';
    SELECT id INTO s_squid FROM species WHERE name = 'Squid';
    SELECT id INTO s_lobster FROM species WHERE name = 'Lobster';
    SELECT id INTO s_anchovy FROM species WHERE name = 'Anchovy';
    SELECT id INTO s_shark FROM species WHERE name = 'Shark';
    SELECT id INTO s_barracuda FROM species WHERE name = 'Barramundi'; -- Using Barramundi as Barracuda placeholder or fix name
    SELECT id INTO s_croaker FROM species WHERE name = 'Croaker';
    SELECT id INTO s_roh FROM species WHERE name = 'Rohu';


    -- Insert Prices (Kochi - Full Market Day)
    INSERT INTO daily_prices (species_id, harbour_id, price_per_kg, trend, trend_percentage, stock_status) VALUES
    (s_seer, h_kochi, 607, 'down', 13, 'high'),
    (s_mackerel, h_kochi, 230, 'up', 8, 'medium'),
    (s_sardine, h_kochi, 141, 'up', 5, 'high'),
    (s_prawn_t, h_kochi, 850, 'stable', 0, 'low'),
    (s_prawn_w, h_kochi, 420, 'up', 4, 'medium'),
    (s_pomfret_b, h_kochi, 602, 'down', 11, 'medium'),
    (s_pomfret_w, h_kochi, 950, 'up', 15, 'low'),
    (s_crab, h_kochi, 455, 'up', 3, 'high'),
    (s_tuna, h_kochi, 280, 'up', 6, 'medium'),
    (s_snapper, h_kochi, 390, 'stable', 1, 'medium'),
    (s_squid, h_kochi, 320, 'down', 5, 'high'),
    (s_lobster, h_kochi, 1800, 'up', 22, 'scarce'),
    (s_anchovy, h_kochi, 180, 'stable', 2, 'high'),
    (s_shark, h_kochi, 450, 'down', 4, 'medium');

    -- Insert Prices (Mumbai Sassoon Dock - High Value Market)
    INSERT INTO daily_prices (species_id, harbour_id, price_per_kg, trend, trend_percentage, stock_status) VALUES
    (s_seer, h_mumbai, 695, 'down', 22, 'medium'),
    (s_mackerel, h_mumbai, 268, 'up', 17, 'low'),
    (s_sardine, h_mumbai, 168, 'up', 19, 'medium'),
    (s_prawn_t, h_mumbai, 920, 'up', 5, 'medium'),
    (s_prawn_w, h_mumbai, 510, 'up', 8, 'medium'),
    (s_pomfret_b, h_mumbai, 720, 'up', 20, 'low'),
    (s_pomfret_w, h_mumbai, 1100, 'up', 25, 'scarce'),
    (s_crab, h_mumbai, 512, 'up', 13, 'medium'),
    (s_tuna, h_mumbai, 350, 'up', 12, 'medium'),
    (s_snapper, h_mumbai, 480, 'up', 9, 'medium'),
    (s_squid, h_mumbai, 380, 'up', 14, 'medium'),
    (s_lobster, h_mumbai, 2200, 'up', 15, 'scarce'),
    (s_anchovy, h_mumbai, 210, 'stable', 4, 'high');

    -- Insert Prices (Vizag - Wholesale Hub)
    INSERT INTO daily_prices (species_id, harbour_id, price_per_kg, trend, trend_percentage, stock_status) VALUES
    (s_seer, h_vizag, 580, 'down', 4, 'high'),
    (s_mackerel, h_vizag, 188, 'down', 18, 'high'),
    (s_sardine, h_vizag, 118, 'down', 16, 'high'),
    (s_prawn_t, h_vizag, 800, 'down', 2, 'medium'),
    (s_pomfret_b, h_vizag, 590, 'down', 2, 'medium'),
    (s_crab, h_vizag, 398, 'down', 13, 'high'),
    (s_tuna, h_vizag, 250, 'down', 8, 'high'),
    (s_snapper, h_vizag, 340, 'down', 5, 'medium'),
    (s_squid, h_vizag, 290, 'stable', 1, 'high'),
    (s_shark, h_vizag, 400, 'down', 6, 'high');

    -- Insert Prices (Chennai Kasimedu - Major Port)
    INSERT INTO daily_prices (species_id, harbour_id, price_per_kg, trend, trend_percentage, stock_status) VALUES
    (s_seer, h_chennai, 620, 'up', 5, 'medium'),
    (s_mackerel, h_chennai, 210, 'stable', 1, 'high'),
    (s_pomfret_b, h_chennai, 650, 'down', 3, 'medium'),
    (s_prawn_t, h_chennai, 880, 'up', 7, 'low'),
    (s_crab, h_chennai, 480, 'up', 10, 'medium'),
    (s_tuna, h_chennai, 300, 'stable', 2, 'high'),
    (s_squid, h_chennai, 340, 'down', 4, 'medium'),
    (s_anchovy, h_chennai, 195, 'up', 6, 'high');

    -- Insert Prices (Mangalore Old Port - Coastal Hub)
    INSERT INTO daily_prices (species_id, harbour_id, price_per_kg, trend, trend_percentage, stock_status) VALUES
    (s_seer, h_mangalore, 595, 'down', 8, 'high'),
    (s_mackerel, h_mangalore, 240, 'up', 12, 'medium'),
    (s_sardine, h_mangalore, 155, 'up', 15, 'high'),
    (s_prawn_w, h_mangalore, 440, 'down', 3, 'medium'),
    (s_pomfret_w, h_mangalore, 980, 'up', 9, 'low'),
    (s_shark, h_mangalore, 420, 'stable', 0, 'medium');

    -- Insert Prices (Veraval - Gujarat Export Hub)
    -- ID already fetched above
    
    INSERT INTO daily_prices (species_id, harbour_id, price_per_kg, trend, trend_percentage, stock_status) VALUES
    (s_pomfret_w, h_veraval, 1050, 'up', 18, 'scarce'),
    (s_pomfret_b, h_veraval, 680, 'up', 12, 'medium'),
    (s_croaker, h_veraval, 320, 'down', 5, 'high'),
    (s_squid, h_veraval, 360, 'up', 8, 'medium'),
    (s_tuna, h_veraval, 290, 'stable', 1, 'high');

    -- Insert Prices (Paradip - East Coast)
    -- ID already fetched above

    INSERT INTO daily_prices (species_id, harbour_id, price_per_kg, trend, trend_percentage, stock_status) VALUES
    (s_prawn_t, h_paradip, 820, 'up', 6, 'medium'),
    (s_crab, h_paradip, 410, 'down', 4, 'high'),
    (s_mackerel, h_paradip, 195, 'stable', 2, 'high'),
    (s_roh, h_paradip, 160, 'up', 5, 'medium'); -- Freshwater influence

END $$;
