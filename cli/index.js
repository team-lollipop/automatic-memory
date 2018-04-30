const inquirer = require('inquirer');
const request = require('superagent');
const Game = require('./game');
const server = 'http://localhost:3000';

console.log('Hi, welcome to Bird\'s eye view!');

let token = '';

const service = {
    signup(userData) {
        return request.post(`${server}/api/auth/signup`)
            .send(userData)
            .then(({ body }) => {
                token = body.token;
                return body;
            });
    }
    // getTask(userId, token) {
    //     return request.get(`${server}/api/task`)
    //      .set('Authorization', token)
    // }
};

const game = new Game(service);
game.start();
