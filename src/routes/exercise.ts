import express from 'express';
import * as exerciseController from '../controllers/exerciseController';
import util from '../utilities/index';

const router = express.Router();

router.get('/', util.handleErrors(exerciseController.getAllExercises));
router.get('/:id', util.handleErrors(exerciseController.getExerciseById));
router.post('/', util.handleErrors(exerciseController.createExercises));
router.put('/:id', util.handleErrors(exerciseController.updateExercise));
router.delete('/:id', util.handleErrors(exerciseController.deleteExercise));

export default router;