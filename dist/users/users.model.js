"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const environment_1 = require("./../common/environment");
const validators_1 = require("./../common/validators");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlenght: 80,
        minlenght: 3
    },
    email: {
        type: String,
        unique: true,
        requires: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validators_1.validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    },
    profiles: {
        type: [String],
        requires: false
    }
});
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};
userSchema.methods.matches = function (password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.methods.hasAny = function (...profiles) {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1);
};
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment_1.environment.security.saltRounds)
        .then(hash => {
        obj.password = hash;
        next();
    }).catch(next);
};
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        hashPassword(user, next);
    }
};
const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);
exports.User = mongoose.model('User', userSchema);
