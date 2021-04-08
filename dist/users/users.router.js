"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const authz_handler_1 = require("./../security/authz.handler");
const auth_handler_1 = require("./../security/auth.handler");
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
        application.get({ path: `${this.basePath}`, version: '2.0.0' }, [authz_handler_1.authorize('admin'), this.findByEmail, this.findAll]);
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, [authz_handler_1.authorize('admin'), this.findAll]);
        // Route method GET for get an user by ID on DB
        application.get(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        // Route method POST for include a user on DB
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        // Route method PUT for substitute document on DB
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin', 'user'), this.validateId, this.replace]);
        // Route method PATH, update the document on DB
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin', 'user'), this.validateId, this.update]);
        // Route method DELETE for delete an document on DB
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        // Route method POST for authenticate user login with JWT
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
