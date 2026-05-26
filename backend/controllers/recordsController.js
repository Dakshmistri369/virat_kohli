import { supabase, isConnected } from '../config/supabase.js';
import { recordsData } from '../data/seedData.js';

// Map database snake_case to frontend camelCase
const mapRecord = (dbRecord) => {
  if (!dbRecord) return null;
  return {
    format: dbRecord.format,
    matches: dbRecord.matches,
    innings: dbRecord.innings,
    runs: dbRecord.runs,
    average: parseFloat(dbRecord.average),
    strikeRate: parseFloat(dbRecord.strike_rate),
    highestScore: dbRecord.highest_score,
    centuries: dbRecord.centuries,
    halfCenturies: dbRecord.half_centuries,
    fours: dbRecord.fours,
    sixes: dbRecord.sixes,
    doubleCenturies: dbRecord.double_centuries,
    wickets: dbRecord.wickets,
    catches: dbRecord.catches
  };
};

// @desc    Get all records
// @route   GET /api/records
// @access  Public
export const getRecords = async (req, res) => {
  try {
    if (isConnected && supabase) {
      const { data, error } = await supabase
        .from('records')
        .select('*');
        
      if (!error && data && data.length > 0) {
        return res.status(200).json(data.map(mapRecord));
      }
      if (error) {
        console.error('Supabase query error (records):', error.message);
      }
    }
    // Fallback to static seed data
    return res.status(200).json(recordsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error: error.message });
  }
};

// @desc    Get record by format
// @route   GET /api/records/:format
// @access  Public
export const getRecordByFormat = async (req, res) => {
  const { format } = req.params;
  try {
    if (isConnected && supabase) {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('format', format)
        .single();
        
      if (!error && data) {
        return res.status(200).json(mapRecord(data));
      }
      if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
        console.error('Supabase query error (format):', error.message);
      }
    }
    // Fallback search
    const record = recordsData.find(r => r.format.toLowerCase() === format.toLowerCase());
    if (record) {
      return res.status(200).json(record);
    }
    return res.status(404).json({ message: `Record for format '${format}' not found` });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching record', error: error.message });
  }
};

// @desc    Create or Update a record in Supabase
// @route   POST /api/records
// @access  Private/Simulated
export const updateRecord = async (req, res) => {
  const { format, matches, innings, runs, average, strikeRate, highestScore, centuries, halfCenturies, fours, sixes, doubleCenturies, wickets, catches } = req.body;
  
  if (!format) {
    return res.status(400).json({ message: 'Format is required' });
  }

  // Prep DB-ready data
  const dbData = {
    format,
    matches,
    innings,
    runs,
    average,
    strike_rate: strikeRate,
    highest_score: highestScore,
    centuries,
    half_centuries: halfCenturies,
    fours,
    sixes,
    double_centuries: doubleCenturies,
    wickets,
    catches
  };

  try {
    if (isConnected && supabase) {
      // Upsert record
      const { data, error } = await supabase
        .from('records')
        .upsert(dbData, { onConflict: 'format' })
        .select()
        .single();

      if (!error) {
        return res.status(200).json({ message: 'Record updated in Supabase', data: mapRecord(data) });
      }
      return res.status(400).json({ message: 'Supabase upsert failed', error: error.message });
    } else {
      // Mock update
      const index = recordsData.findIndex(r => r.format.toLowerCase() === format.toLowerCase());
      const updatedData = { format, matches, innings, runs, average, strikeRate, highestScore, centuries, halfCenturies, fours, sixes, doubleCenturies, wickets, catches };
      if (index !== -1) {
        recordsData[index] = { ...recordsData[index], ...updatedData };
      } else {
        recordsData.push(updatedData);
      }
      return res.status(200).json({ message: 'Record updated locally (Mock Mode)', data: updatedData });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating record', error: error.message });
  }
};
