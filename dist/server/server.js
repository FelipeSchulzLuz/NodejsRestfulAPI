"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const environment_1 = require("../common/environment");
const restify = require("restify");
const mongoose = require("mongoose");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const logger_1 = require("../common/logger");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger_1.logger
                });
                this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger
                }));
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                // Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
