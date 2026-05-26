import { supabase, isConnected } from '../config/supabase.js';
import { galleryData } from '../data/seedData.js';

// Map database snake_case to frontend camelCase
const mapGalleryItem = (dbItem) => {
  if (!dbItem) return null;
  return {
    id: dbItem.id,
    title: dbItem.title,
    description: dbItem.description,
    imageUrl: dbItem.image_url,
    category: dbItem.category,
    year: dbItem.year
  };
};

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res) => {
  try {
    if (isConnected && supabase) {
      const { data, error } = await supabase
        .from('gallery')
        .select('*');
        
      if (!error && data && data.length > 0) {
        return res.status(200).json(data.map(mapGalleryItem));
      }
      if (error) {
        console.error('Supabase query error (gallery):', error.message);
      }
    }
    // Fallback to static seed data
    return res.status(200).json(galleryData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery', error: error.message });
  }
};

// @desc    Get gallery items by category
// @route   GET /api/gallery/category/:category
// @access  Public
export const getGalleryByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    if (isConnected && supabase) {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('category', category);
        
      if (!error && data) {
        return res.status(200).json(data.map(mapGalleryItem));
      }
      if (error) {
        console.error('Supabase query error (gallery category):', error.message);
      }
    }
    // Fallback
    const filtered = galleryData.filter(item => item.category.toLowerCase() === category.toLowerCase());
    return res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery category', error: error.message });
  }
};
