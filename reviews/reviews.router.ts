import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { Review } from './reviews.model'
import { NotFoundError } from 'restify-errors'
import * as mongoose from 'mongoose'



class ReviewsRouter extends ModelRouter<Review>{
    constructor(){
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review,Review>):mongoose.DocumentQuery<Review,Review>{
        return query.populate('user','name')
                    .populate('restaurant')
    }


    applyRoutes(application: restify.Server) {
        
        // Route for get all users on DB
        application.get('/reviews', this.findAll)

        // Route method GET for get an review by ID on DB
        application.get('/reviews/:id',[this.validateId, this.findById])

        // Route method POST for include a review on DB
        application.post('/reviews', this.save)

        // Route method DELETE for delete an document on DB
        application.del('/reviews/:id', [this.validateId,this.delete])
    }

}

export const reviewsRouter = new ReviewsRouter();