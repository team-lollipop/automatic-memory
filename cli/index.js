const request = require('superagent');
const Game = require('./game');
const emoji = require('./emoji');
// best to use a env variable for this!
const server = 'https://better-birds-eye-view.herokuapp.com';
// ok to just require :)
require('colors');

console.log(`\n\n\n\nHi, welcome to Bird's eye view! ${emoji.bird[1]} \n\n`.blue.bold); // eslint-disable-line

let token = '';

const service = {
    signUp(userData) {
        return request.post(`${server}/api/auth/signup`)
            .send(userData)
            .then(({ body }) => {
                token = body.token;
                return body;
            });
    },
    signIn(userData) {
        return request.post(`${server}/api/auth/signin`)
            .send(userData)
            .then(({ body }) => {
                token = body.token;
                return body;
            });

    },
    getTask(userId) {
        return request.get(`${server}/api/users/${userId}/intro`)
            .set('Authorization', token)
            .then(({ body }) => {
                return body;
            });
    },
    getOption(userId, direction) {
        return request.get(`${server}/api/users/${userId}/options/${direction}`)
            .set('Authorization', token)
            .then(({ body }) => {
                return body;
            });
    },
    addItem(userId, item) {
        return request.post(`${server}/api/users/${userId}/inventory`)
            .set('Authorization', token)
            .send({ type: item })
            .then(({ body }) => {
                return body;
            });
    },
    getInventory(userId) {
        return request.get(`${server}/api/users/${userId}/inventory`)
            .set('Authorization', token)
            .then(({ body }) => {
                return body;
            });
    },
    deleteInventory(userId) {
        return request.delete(`${server}/api/users/${userId}/inventory`)
            .set('Authorization', token)
            .then(({ body }) => {
                return body;
            });
    },
    getLevel(userId) {
        return request.get(`${server}/api/users/${userId}/level`)
            .set('Authorization', token)
            .then(({ body }) => {
                return body;
            });
    },
    updateLevel(userId, newLevel) {
        return request.put(`${server}/api/users/${userId}/level`)
            .set('Authorization', token)
            .send({ level: newLevel })
            .then(({ body }) => {
                return body;
            });
    }
};

const game = new Game(service);
game.start();
