/* eslint no-console:off */
const inquirer = require('inquirer');
const colors = require('colors'); // eslint-disable-line

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
                this.user = name;
                this.api.token = token;
                lineBreak();
                // console.log(`Welcome ${name.green}!`);
                this.presentTask(userId);
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
                lineBreak();                
                console.log(task.intro.replace('(User Name)', this.user).blue);
                this.showOptions(userId);
            });
    }
    showOptions(userId) {
        lineBreak();        
        return inquirer.prompt({
            type: 'list',
            name: 'direction',
            message: 'Which direction would you like to fly?',
            choices: [{ name:'North', value: 'n' },
                { name: 'South', value: 's' },
                { name: 'East', value: 'e' },
                { name: 'West', value: 'w' }]
        })
            .then(({ direction }) => {
                this.resolveAction(userId, direction);
            });
    }
    resolveAction(userId, direction) {       
        this.api.getOption(userId, direction)
            .then(body => {
                switch(body.action) {
                    case 'look':
                        lineBreak();
                        console.log(`${body.info} You fly back.`.cyan);
                        this.showOptions(userId);
                        break;
                    case 'interact':
                        this.addToInventory(userId, body.info);
                        break;
                    case 'resolve':
                        lineBreak();
                        console.log(body.info.desc.cyan);
                        this.completeTask(userId, body.info.resolved, body.info.unresolved);
                }
            });   
    }
    addToInventory(userId, itemInfo) {
        this.api.checkInventory(userId)
            .then(body => {
                if(body.inventory[0] === itemInfo.type) {
                    lineBreak();                    
                    console.log(`This is where you found your ${body.inventory[0]}. You fly back.`.magenta);
                    this.showOptions(userId);
                } else {
                    lineBreak();
                    console.log(itemInfo.itemDesc.cyan);
                    this.api.addItem(userId, itemInfo.type)
                        .then(body => {
                            lineBreak();                
                            console.log(`You fly back with ${body.inventory[0]} in your inventory.`.magenta);
                            this.showOptions(userId);                
                        });
                }
            });
    }
    completeTask(userId, resolved, unresolved) {
        this.api.checkInventory(userId)
            .then(body => {
                if(body.found) {
                    console.log(resolved);
                    // delete inventory here?
                    // check level status and update
                // TODO: Endgame / next task
                } else {
                    lineBreak();                    
                    console.log(unresolved.cyan);
                    this.showOptions(userId);                
                }
            });
    }
}


module.exports = Game;