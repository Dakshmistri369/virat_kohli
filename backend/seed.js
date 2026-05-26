import dotenv from 'dotenv';
import { supabase, isConnected } from './config/supabase.js';
import { recordsData, galleryData } from './data/seedData.js';

dotenv.config();

const seedDatabase = async () => {
  console.log('🌱 Starting Supabase Database Seeding...');
  
  if (!isConnected || !supabase) {
    console.error('❌ Supabase client not initialized. Check your .env file containing SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY).');
    process.exit(1);
  }

  try {
    // 1. Seed Records
    console.log('Cleaning existing records in Supabase...');
    // Delete all records (where id is greater than 0)
    const { error: recordsDelError } = await supabase
      .from('records')
      .delete()
      .gt('id', 0);

    if (recordsDelError) {
      console.warn('Note on records clean-up:', recordsDelError.message);
    }

    console.log('Inserting fresh records...');
    const mappedRecords = recordsData.map(r => ({
      format: r.format,
      matches: r.matches,
      innings: r.innings,
      runs: r.runs,
      average: r.average,
      strike_rate: r.strikeRate,
      highest_score: r.highestScore,
      centuries: r.centuries,
      half_centuries: r.halfCenturies,
      fours: r.fours,
      sixes: r.sixes,
      double_centuries: r.doubleCenturies,
      wickets: r.wickets,
      catches: r.catches
    }));

    const { error: recordsInsError } = await supabase
      .from('records')
      .insert(mappedRecords);

    if (recordsInsError) {
      throw new Error(`Failed to insert records: ${recordsInsError.message}`);
    }
    console.log(`✅ Successfully seeded ${mappedRecords.length} records!`);

    // 2. Seed Gallery
    console.log('Cleaning existing gallery items in Supabase...');
    const { error: galleryDelError } = await supabase
      .from('gallery')
      .delete()
      .gt('id', 0);

    if (galleryDelError) {
      console.warn('Note on gallery clean-up:', galleryDelError.message);
    }

    console.log('Inserting fresh gallery items...');
    const mappedGallery = galleryData.map(g => ({
      title: g.title,
      description: g.description,
      image_url: g.imageUrl,
      category: g.category,
      year: g.year
    }));

    const { error: galleryInsError } = await supabase
      .from('gallery')
      .insert(mappedGallery);

    if (galleryInsError) {
      throw new Error(`Failed to insert gallery: ${galleryInsError.message}`);
    }
    console.log(`✅ Successfully seeded ${mappedGallery.length} gallery items!`);

    console.log('🎉 Supabase Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error during seeding: ${error.message}`);
    console.log('\n💡 TIPS TO FIX:');
    console.log('1. Make sure you have created the tables in your Supabase SQL editor by running "supabase_setup.sql".');
    console.log('2. If you have Row Level Security (RLS) enabled, you must use your Supabase "service_role" key in the backend .env for seeding, or configure RLS to allow inserts from public.');
    process.exit(1);
  }
};

seedDatabase();
