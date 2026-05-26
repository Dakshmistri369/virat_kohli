import express from 'express';
import { getGallery, getGalleryByCategory } from '../controllers/galleryController.js';

const router = express.Router();

router.route('/')
  .get(getGallery);

router.route('/category/:category')
  .get(getGalleryByCategory);

export default router;
