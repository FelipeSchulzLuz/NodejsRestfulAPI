import { Router } from '../common/router'
import * as restify from 'restify'
import { User } from './users.model'
import {NotFoundError} from 'restify-errors'



class UsersRouter extends Router {
    constructor(){
        super()
        this.on('beforeRender', document=>{
            document.password = undefined
        })
    }
    applyRoutes(application: restify.Server) {
        // Route for get all users on DB
        application.get('/users', (req, res, next) => {
            User.find()
            .then(this.render(res,next))
            .catch(next)
        })

        // Route method GET for get an user by ID on DB
        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id)
            .then(this.render(res,next))
            .catch(next)
        })

        // Route method POST for include a user on DB
        application.post('/users', (req, res, next) => {
            let user = new User(req.body)
            user.save()
            .then(this.render(res,next))
            .catch(next)
        })

        // Route method PUT for substitute document on DB
        application.put('/users/:id', (req, res, next) => {
            const options = {runValidators:true, overwrite: true }
            User.update({ _id: req.params.id }, req.body, options).exec()
            .then(result => {
                if (result.n) {
                    return User.findById(req.params.id)
                } else {
                    throw new NotFoundError('Documento não encontrado')
                }
            }).then(this.render(res,next))
            .catch(next)
        })

        // Route method PATH, update the document on DB
        application.patch('/users/:id', (req, res, next) => {
            const options = { runValidators:true, new: true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(res,next)).catch(next)
        });

        // Route method DELETE for delete an document on DB
        application.del('/users/:id', (req,res,next)=>{
            User.remove({_id:req.params.id}).exec()
            .then((cmdResult: any)=>{
                if(cmdResult.result.n){
                    res.send(204)
                }else{
                    throw new NotFoundError('Documento não encontrado')
                }
                return next()
            }).catch(next)
        })
    }
}

export const usersRouter = new UsersRouter()