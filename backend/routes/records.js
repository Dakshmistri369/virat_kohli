import express from 'express';
import { getRecords, getRecordByFormat, updateRecord } from '../controllers/recordsController.js';

const router = express.Router();

router.route('/')
  .get(getRecords)
  .post(updateRecord);

router.route('/:format')
  .get(getRecordByFormat);

export default router;
