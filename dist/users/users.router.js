"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, res, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(res, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        // Route for get all users on DB
        application.get({ path: `${this.basePath}`, version: '2.0.0' }, [this.findByEmail, this.findAll]);
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, this.findAll);
        // Route method GET for get an user by ID on DB
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        // Route method POST for include a user on DB
        application.post(`${this.basePath}`, this.save);
        // Route method PUT for substitute document on DB
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        // Route method PATH, update the document on DB
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        // Route method DELETE for delete an document on DB
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
    }
}
exports.usersRouter = new UsersRouter();
