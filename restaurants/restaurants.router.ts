import { authorize } from './../security/authz.handler';
import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { Restaurant } from './restaurants.model'
import { NotFoundError } from 'restify-errors'
class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant)
    }

    envelope(document) {
        let resource = super.envelope(document)
        resource._links.menu = `${this.basePath}/${resource._id}/menu`
        return resource
    }

    findMenu = (req, res, next) => {
        Restaurant.findById(req.params.id, "+menu").then(restaurant => {
            if (!restaurant) {
                throw new NotFoundError('Restaurant not found')
            } else {
                res.json(restaurant.menu)
                return next()
            }
        }).catch(next)
    }

    replaceMenu = (req, res, next) => {
        Restaurant.findById(req.params.id).then(restaurant => {
            if (!restaurant) {
                throw new NotFoundError('Restaurant not found')
            } else {
                restaurant.menu = req.body // Array de MenuItem
                return restaurant.save()
            }
        }).then(restaurant => {
            res.json(restaurant.menu)
            return next()
        }).catch(next)
    }

    applyRoutes(application: restify.Server) {

        // Route for get all restaurants on DB
        application.get(`${this.basePath}`, this.findAll)

        // Route method GET for get an user by ID on DB
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])

        // Route method POST for include a user on DB
        application.post(`${this.basePath}`, [authorize('admin'), this.save])

        // Route method PUT for substitute user on DB
        application.put(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.replace])

        // Route method PATH, update the user on DB
        application.patch(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.update])

        // Route method DELETE for delete an user on DB
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete])

        // Route method GET an restaurant by ID on DB
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu])

        // Route for 
        application.put(`${this.basePath}/:id/menu`, [authorize('admin'), this.validateId, this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantsRouter()