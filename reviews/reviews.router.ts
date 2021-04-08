import { authorize } from './../security/authz.handler';
import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { Review } from './reviews.model'
import * as mongoose from 'mongoose'



class ReviewsRouter extends ModelRouter<Review>{
    constructor() {
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name')
            .populate('restaurant')
    }

    envelope(document) {
        let resource = super.envelope(document)
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurant/${restId}`
        return resource
    }

    applyRoutes(application: restify.Server) {

        // Route for get all users on DB
        application.get(`${this.basePath}`, this.findAll)

        // Route method GET for get an review by ID on DB
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])

        // Route method POST for include a review on DB
        application.post(`${this.basePath}`, [authorize('user'), this.save])

        // Route method DELETE for delete an document on DB
        application.del(`${this.basePath}/:id`, [authorize('user'), this.validateId, this.delete])
    }

}

export const reviewsRouter = new ReviewsRouter();