import { restaurantsRouter } from './restaurants.router';
import { Restaurant } from './restaurants.model';
import 'jest'
import * as request from "supertest"
import { environment } from './../common/environment';


let address: string = (<any>global).address

test('get /restaurants', () => {
    return request(address)
        .get('/restaurants')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})


test('post /restaurants', () => {
    return request(address)
        .post('/restaurants')
        .send({
            name: "RESTAURANT",
            menu: []
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('RESTAURANT')
        }).catch(fail)
})