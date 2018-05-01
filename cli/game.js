const inquirer = require('inquirer');
const colors = require('colors');

const lineBreak = () => console.log('\n');

const signupQuestions = [
    {
        type: 'list',
        name: 'auth',
        message: 'Are you a new or returning user?\n\n',
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
            .then(({ token, name, userId }) => {
                this.api.token = token;
                lineBreak();
                console.log(`Welcome ${name.green}!`);
                this.getTask(userId);
            })
            .catch((err) => {
                lineBreak();
                console.log(JSON.parse(err.response.text).error.yellow, 'Please try again!'.bold.cyan);
                lineBreak();
                this.start();
            });
    }
    presentTask(userId) {
        this.api.getTask(userId, this.api.token)
            .then(task => {
                console.log(task);
                return inquirer.prompt({
                    type: 'list',
                    name: 'direction',
                    choices: [{ name:'North', value: 'n' },
                        { name: 'South', value: 's' },
                        { name: 'East', value: 'e' },
                        { name: 'West', value: 'w' }]
                })
                    .then(({ direction }) => {
                        this.api.getOptions(userId, direction)
                            .then((body) => {
                                const resolved = body.resolved;
                                const unresolved = body.unresolved;
                                console.log(body.description);
                                if(body.action === 'interact') {
                                    this.api.addItem(userId, body.item.type)
                                        .then((body) => {
                                            console.log(`${body.inventory[0]} has been added to your inventory!`);
                                        });
                                } else if(body.action === 'resolve') {
                                    this.api.checkInventory(userId)
                                        .then(body => {
                                            if(body.found) {
                                                console.log(resolved);
                                            // TODO: Endgame / next task
                                            } else console.log(unresolved);
                                        });
                                }


                            });
                    });
            });
    }
}


module.exports = Game;