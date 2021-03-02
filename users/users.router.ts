import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { User } from './users.model'
import {NotFoundError} from 'restify-errors'




class UsersRouter extends ModelRouter<User> {
    constructor(){
        super(User)
        this.on('beforeRender', document=>{
            document.password = undefined
        })
    }
    applyRoutes(application: restify.Server) {
        
        // Route for get all users on DB
        application.get('/users', this.findAll)

        // Route method GET for get an user by ID on DB
        application.get('/users/:id',[this.validateId, this.findById])

        // Route method POST for include a user on DB
        application.post('/users', this.save)

        // Route method PUT for substitute document on DB
        application.put('/users/:id', [this.validateId,this.replace])

        // Route method PATH, update the document on DB
        application.patch('/users/:id', [this.validateId,this.update])

        // Route method DELETE for delete an document on DB
        application.del('/users/:id', [this.validateId,this.delete])
    }
}

export const usersRouter = new UsersRouter()