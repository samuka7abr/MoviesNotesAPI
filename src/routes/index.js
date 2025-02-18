const { Router } = require('express');

const sessionsRoutes = require('./sessions.routes');
const mooviesRoutes = require('./moovies.routes');
const usersRoutes = require('./users.routes');
const tagsRoutes = require('./tags.routes');

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/moovies', mooviesRoutes);
routes.use('/users', usersRoutes);
routes.use('/tags', tagsRoutes);


module.exports = routes;