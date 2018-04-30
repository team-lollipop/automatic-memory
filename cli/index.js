const inquirer = require('inquirer');
const request = require('superagent');
const Game = require('./game');
const server = 'http://localhost:3000';
const emoji = require('node-emoji');

const bird = emoji.get('bird');
const babyBird = emoji.get('baby_chick');

console.log('Hi, welcome to Bird\'s eye view!', babyBird);


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
