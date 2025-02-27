const { Router } = require('express');

const MooviesController = require('../controllers/MooviesController');

const mooviesRoutes = Router();

const mooviesController = new MooviesController;

mooviesRoutes.post('/', mooviesController.create);
mooviesRoutes.get('/:id', mooviesController.show);
mooviesRoutes.delete('/:id', mooviesController.delete);
mooviesRoutes.get('/', mooviesController.index);

module.exports = mooviesRoutes;