import { authorize } from './../security/authz.handler';
import { authenticate } from './../security/auth.handler';
import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { User } from './users.model'
import { NotFoundError } from 'restify-errors'


class UsersRouter extends ModelRouter<User> {
    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    findByEmail = (req, res, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => {
                    if (user) {
                        return [user]
                    } else {
                        return []
                    }
                })
                .then(this.renderAll(res, next))
                .catch(next)
        } else {
            next()
        }
    }


    applyRoutes(application: restify.Server) {

        // Route for get all users on DB
        application.get({ path: `${this.basePath}`, version: '2.0.0' }, [authorize('admin'), this.findByEmail, this.findAll])
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, [authorize('admin'), this.findAll])


        // Route method GET for get an user by ID on DB
        application.get(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.findById])

        // Route method POST for include a user on DB
        application.post(`${this.basePath}`, [authorize('admin'), this.save])

        // Route method PUT for substitute document on DB
        application.put(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.replace])

        // Route method PATH, update the document on DB
        application.patch(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.update])

        // Route method DELETE for delete an document on DB
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete])

        // Route method POST for authenticate user login with JWT
        application.post(`${this.basePath}/authenticate`, authenticate)
    }
}

export const usersRouter = new UsersRouter()