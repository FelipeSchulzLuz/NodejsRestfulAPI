import { Review } from './reviews/reviews.model';
import { reviewsRouter } from './reviews/reviews.router';
import { usersRouter } from './users/users.router';
import { User } from './users/users.model';
import { environment } from './common/environment';
import { Server } from './server/server';
import 'jest'
import * as jestCli from 'jest-cli'
import * as request from "supertest"

let server: Server

const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    return server.bootstrap([
        usersRouter,
        reviewsRouter
    ])
        .then(() => User.remove({}).exec())
        .then(() => Review.remove({}).exec())
}

const afterAllTests = () => {
    return server.shutdown()
}

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error)