const inquirer = require('inquirer');
const request = require('superagent');
const Game = require('./game');
const emoji = require('./emoji');
const server = 'http://localhost:3000';
const colors = require('colors');


console.log(`Hi, welcome to Bird's eye view! ${emoji.bird[1]} \n\n`.blue.bold);


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
        return request.get(`${server}/api/users/${userId}/directions/${direction}`)
            .then(({ body }) => {
                return body;
            });
    },
    addItem(userId, item) {
        return request.post(`${server}/api/users/${userId}/inventory`)
            .send(item)
            .then(({ body }) => {
                return body;
            });
    },
    checkInventory(userId) {
        return request.get(`${server}/api/users/${userId}/inventory`)
            .then(({ body }) => {
                return body;
            });
    
    },
    deleteInventory(userId) {
        return request.get(`${server}/api/users/${userId}/inventory`)
            
    }
};

const game = new Game(service);
game.start();
