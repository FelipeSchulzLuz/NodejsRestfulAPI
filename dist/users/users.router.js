"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
const restify_errors_1 = require("restify-errors");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        // Route for get all users on DB
        application.get('/users', (req, res, next) => {
            users_model_1.User.find()
                .then(this.render(res, next))
                .catch(next);
        });
        // Route method GET for get an user by ID on DB
        application.get('/users/:id', (req, res, next) => {
            users_model_1.User.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next);
        });
        // Route method POST for include a user on DB
        application.post('/users', (req, res, next) => {
            let user = new users_model_1.User(req.body);
            user.save()
                .then(this.render(res, next))
                .catch(next);
        });
        // Route method PUT for substitute document on DB
        application.put('/users/:id', (req, res, next) => {
            const options = { overwrite: true };
            users_model_1.User.update({ _id: req.params.id }, req.body, options).exec()
                .then(result => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(this.render(res, next))
                .catch(next);
        });
        // Route method PATH, update the document on DB
        application.patch('/users/:id', (req, res, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next)).catch(next);
        });
        // Route method DELETE for delete an document on DB
        application.del('/users/:id', (req, res, next) => {
            users_model_1.User.remove({ _id: req.params.id }).exec()
                .then((cmdResult) => {
                if (cmdResult.result.n) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
        });
    }
}
exports.usersRouter = new UsersRouter();
