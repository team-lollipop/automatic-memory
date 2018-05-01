const inquirer = require('inquirer');
const request = require('superagent');
const Game = require('./game');
const emoji = require('./emoji');
const server = 'http://localhost:3000';
const colors = require('colors');


console.log('Hi, welcome to Bird\'s eye view!', emoji.bird[1]);


let token = '';

const service = {
    signUp(userData) {
        return request.post(`${server}/api/auth/signup`)
            .send(userData)
            .then(({ body }) => {
                token = body.token;
                body.message = `Welcome ${body.name.green}!`;
                return body;
            });
    },
    signIn(userData) {
        return request.post(`${server}/api/auth/signin`)
            .send(userData)
            .then(({ body }) => {
                token = body.token;
                body.message = `Welcome back, ${body.name.green}!`;
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
