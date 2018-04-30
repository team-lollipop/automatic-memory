const inquirer = require('inquirer');

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
            .then(({ name }) => {
                console.log('hello', name);
            })
            .catch(err => console.error(err));
    }
}


module.exports = Game;