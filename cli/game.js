const inquirer = require('inquirer');
const colors = require('colors');


const signupQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'Please enter your username'
    },
    {
        type: 'password',
        name: 'password',
        message: 'Please enter your password'
    }
]

class Game {
    constructor(api) {
        this.api = api;
    }
    start() {
        inquirer.prompt(signupQuestions)
            .then(({ name, password }) => this.api.signup({ name, password }))
            .then(({ token, name, userId }) => {
                this.api.token = token;
                console.log('hello'.green, name.yellow);
                // this.createTask(userId);
            })
            .catch(err => console.error(err));
    }
    // createTask(userId) {
    //     this.api.getTask(userId, this.api.token)
    //         .then(task => {
    //             // do stuff

    //         });

    // }
}


module.exports = Game;