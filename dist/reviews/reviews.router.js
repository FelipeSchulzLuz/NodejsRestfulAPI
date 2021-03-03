"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsRouter = void 0;
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
    }
    prepareOne(query) {
        return query.populate('user', 'name')
            .populate('restaurant');
    }
    applyRoutes(application) {
        // Route for get all users on DB
        application.get('/reviews', this.findAll);
        // Route method GET for get an review by ID on DB
        application.get('/reviews/:id', [this.validateId, this.findById]);
        // Route method POST for include a review on DB
        application.post('/reviews', this.save);
        // Route method DELETE for delete an document on DB
        application.del('/reviews/:id', [this.validateId, this.delete]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
