"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantsRouter = void 0;
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
const restify_errors_1 = require("restify-errors");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu").then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    res.json(restaurant.menu);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id).then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    restaurant.menu = req.body; // Array de MenuItem
                    return restaurant.save();
                }
            }).then(restaurant => {
                res.json(restaurant.menu);
                return next();
            }).catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(application) {
        // Route for get all restaurants on DB
        application.get(`${this.basePath}`, this.findAll);
        // Route method GET for get an user by ID on DB
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        // Route method POST for include a user on DB
        application.post(`${this.basePath}`, this.save);
        // Route method PUT for substitute user on DB
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        // Route method PATH, update the user on DB
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        // Route method DELETE for delete an user on DB
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        // Route method GET an restaurant by ID on DB
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        // Route for 
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
