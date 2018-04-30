const inquirer = require('inquirer');
const colors = require('colors');

const lineBreak = () => console.log('\n');

const signupQuestions = [
    {
        type: 'list',
        name: 'auth',
        message: 'Are you a new or returning user?',
        choices: [{ name:'This is my first time, sign me up!', value: 'signUp' }, { name: 'I\'ve been here before, sign me in!', value: 'signIn' }]
    },
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
];

class Game {
    constructor(api) {
        this.api = api;
    }
    start() {
        inquirer.prompt(signupQuestions)
            .then(({ auth, name, password }) => this.api[auth]({ name, password }))
            .then(({ token, name, userId, message }) => {
                this.api.token = token;
                lineBreak();
                console.log(message);
                // this.createTask(userId);
            })
            .catch((err) => {
                lineBreak();
                console.log(JSON.parse(err.response.text).error.yellow, 'Please try again!');
                lineBreak();
                this.start();                
            });
    }
    // createTask(userId) {
    //     this.api.getTask(userId, this.api.token)
    //         .then(task => {
    //             // do stuff

    //         });

    // }
}


module.exports = Game;