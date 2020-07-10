const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const UserController = require('./controllers/UserController');
const LoginController = require('./controllers/LoginController');
const VehicleController = require('./controllers/VehicleController');

const routes = express.Router();

/**
 * GET user
 */
routes.get('/user', UserController.index);

/**
 * POST user
 */
routes.post('/user', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        pwd: Joi.string().required(),
    })
}), UserController.create);

/**
 * DELETE user
 */
routes.delete('/user/:id', UserController.delete);

/**
 * POST login
 */
routes.post('/login', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        pwd: Joi.string().required(),
    })
}), LoginController.create);

/**
 * GET vehicle
 */
routes.get('/vehicle', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
        plate: Joi.string(),
    })
}), VehicleController.index);

/**
 * POST vehicle
 */
routes.post('/vehicle', celebrate({
    [Segments.BODY]: Joi.object().keys({
        plate: Joi.string().required(),
    })
}), VehicleController.create);

/**
 * DELETE vehicle
 */
routes.delete('/vehicle/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), VehicleController.delete);

module.exports = routes;
