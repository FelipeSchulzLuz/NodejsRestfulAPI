import { reviewsRouter } from './reviews/reviews.router';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { usersRouter } from './users/users.router';
import { Server } from './server/server'


const server = new Server()
server.bootstrap([usersRouter, restaurantsRouter, reviewsRouter]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1)
})