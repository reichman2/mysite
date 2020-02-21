"use strict";


var writeSpeed = 25; // Write speed per char in ms.
var cmdIsRunning;


const Entity = {
    entities: [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ],

    /**
     * 
     */
    encode: (str) => {
        Entity.entities.forEach(ent => {
            let search = new RegExp("" + ent[1] + "", "g");
            str = str.replace(search, '&' + ent[0] + ';');
        });

        return str;
    },

    decode: (str) => {
        Entity.entities.forEach(ent => {
            let search = new RegExp('&' + ent[0] + ';', 'g');
            str = str.replace(search, ent[1]);
             
        });

        return str;
    }
}

/**
 * A Class that defines a command.
 */
class Command {
    /**
     * Construct a command.
     * @param {String} name 
     * @param {Function} action 
     * @param {Array<String>} aliases 
     */
    constructor(name, action, aliases = []) {
        this.name = name; // String
        this.action = action; // Function
        this.aliases = aliases; // Array
    }
}


/**
 * Appends the msg string to the output.
 * @param {String} msg 
 * @param {Number} delay
 */
function write(msg, delay = 0) {
    return new Promise((resolve, reject) => {
        let out = $('#text');
        let txt = "";

        if (delay === 0) {
            out.append(msg);
            resolve("done");
            // setTimeout(() => resolve("done"), 1000);
        } else {
            let i = 0;
            let pre = out.html();
            let sub = '';
            let intervalId = setInterval(() => {
                // out.append(msg.charAt(i++));
                if (i > msg.length) {
                    clearInterval(intervalId);
                    // setTimeout(() => resolve("done"), 1000);
                    resolve("done");
                }
            
                if (msg.charAt(i) == '<') {
                    let indexOfEnd = msg.substring(i, msg.length).indexOf('>') + i;
                    sub += msg.substring(i, indexOfEnd + 1);
                    i += msg.substring(i, indexOfEnd + 1).length;
                } else {
                    sub += msg.charAt(i++);
                }

                // out.append(sub).contents().filter(() => this.nodeType === 3).remove();
                out.html(pre + sub);
            }, delay);
        }
    });
}

/**
 * Appends a string to the output and then returns to a new line.
 * @param {String} msg 
 * @param {Number} delay 
 */
async function writeLine(msg, delay = 0) {
   await write(msg, delay);
   $("#text").append("<br />");
}

/**
 * Write a clickable link to the terminal window.
 * @param {String} msg The innerHTML which would be linked (inside the <a> tag).
 * @param {String} href The link to redirect to.
 * @param {Number} delay The delay between each character.
 */
async function writeLink(msg, href, delay=0) {
    await write(`<a href="${href}" class="blue">${msg}</a>`, delay);
}


// Declare commands
const commands = {
    about: new Command("about", async args => {
        // TODO: add about me.
    }),
    
    contact: new Command("contact", async args => {
        // TODO: add my contact info.
    }),

    portfolio: new Command("portfolio", async args => {
        // TODO: add github, bitbucket, deployments, etc.
        await writeLine("You can find my open-source projects in these places:\n", writeSpeed);
        await write(" - GitHub: ", writeSpeed);
        await writeLink("https://github.com/reichman2", "https://github.com/reichman2", writeSpeed);
        await write("<br /> - BitBucket: ", writeSpeed);
        await writeLink("https://https://bitbucket.org/", "https://bitbucket.org/", writeSpeed);
    }),

    help: new Command("help", async args => {
        await write("<pre>about:     Prints information about me\n" +                
        "contact:   Prints out the best ways to contact me\n" +
        "portfolio: Prints out my portfolio\n" +
        "help:      Prints out this list of commands\n" +
        "echo:      Prints out given text\n" +
        "sudo:      Run a command with elevated privileges\n" +
        "passwd:    Change a user's password\n" +
        "cd:        Change the current working directory\n" +
        "ls:        Lists all the files in the working directory\n" +
        "clear:     Clears the terminal screen.\n" +
        "exit:      Quits the terminal and redirects to the home page.</pre>", writeSpeed);
    }),
    
    echo: new Command("echo", async args => {
        if (args.toString().length > 5000)
            await writeLine("Error: input is too long.", writeSpeed);

        let eStr = "";

        for (let i = 1; i < args.length; i++) {
            eStr += args[i] + " ";
        }

        writeLine(eStr, writeSpeed);        
    }),
    
    sudo: new Command("sudo", async args => {
        await writeLine("guest is not in the sudoers file. This incident will be reported.", writeSpeed)
    }),
    
    passwd: new Command("passwd", async args => {
        await writeLine("guest users cannot use this command!", writeSpeed);
    }),
    
    cd: new Command("cd", async args => {
        await writeLine("guest users cannot use this command!")
    }),
    
    ls: new Command("ls", async args => {
        await writeLine("guest users cannot use this command!")
    }),

    clear: new Command("clear", async args => {
        $("#text").html("");
    }),

    exit: new Command("exit", async args => {
        await writeLine("logout", writeSpeed);
        window.location = "/";
    }),

    setspeed: new Command("setspeed", async args => {
        let nspeed = Number.parseFloat(args[1]);
        if (nspeed && nspeed >= 0 && nspeed <= 1000) {
            writeSpeed = nspeed;
            await writeLine(`Write speed set to ${nspeed}`);
        } else {
            await writeLine(`Error: ${nspeed} is not a valid.  Must be a float && 0 <= arg <= 100`);
        }
    })
};

async function processCommand(cmd) {
    return new Promise(async (resolve, reject) => {
        cmdIsRunning = true;
        $("#inputLine").css({"display": "none"});
        if (!commands[cmd.split(" ")[0]]) {
            // TODO cmd is not defined -- return an error msg to the user.
            await writeLine("Command '" + cmd + "' not found. <br />Run 'help' for a list of commands.", writeSpeed);
            $("#inputLine").css({"display": "inline-block"});
            cmdIsRunning = false;
            reject(new Error("Command Not Found!"));
        } else {
            await commands[cmd.split(" ")[0]].action(cmd.split(" "));
            cmdIsRunning = false;
            $("#inputLine").css({"display": "inline-block"});
            resolve("done");
        }
    });
}

async function startup() {
    // TODO: fun hackertype looking stuff as startup.  Maybe print user's ip?
}

class CommandStack {
    constructor() {
        this.stack = [];
        this.pos = 0;
        this.temp = null;
    }

    up(temp="") {
        if (this.pos + 1 < this.stack.length) {
            if (temp != "") {
                this.temp = temp;
            }

            return this.stack[this.pos++];
        }
        
        return this.stack[this.pos];
    }

    down() {
        if (this.pos == 0) {
            return null;
        }

        if (this.pos - 1 > 0)
            return this.stack[this.pos--];
        
        

        return (this.temp? this.temp : "")
    }

    append(val) {
        this.stack.push(val);
    }

    length() {
        return this.stack.length;
    }
}

var cmdStack = new CommandStack();

const prefix = '<span class="green">guest@brianr:</span><span class="dir blue">~</span><span class="white">$</span> ';

$(async function() {
    let input = $('#input');
    $(window).on('keydown', async e => {
        console.log(e.keyCode);

        if (cmdIsRunning)
            return;

        if (e.keyCode === 10 || e.keyCode === 13) { // Return
            let txt = input.html();
            cmdStack.stack.push(txt);
            cmdStack.pos = 0;
            input.html("");
            await writeLine(prefix + txt);
            await processCommand(txt);

            e.preventDefault();
        } else if (e.keyCode === 8) { // Backspace
            let txt = Entity.decode(input.html());
            // console.log(txt);
            input.html(txt.substr(0, txt.length - 1));
            
            
            e.preventDefault();
         } //else if (e.keyCode === 38) { // UP
        //     input.html(cmdStack.up(cmdStack.pos == 0? input.html() : ""));
        //     e.preventDefault();
        // } else if (e.keyCode === 40) { // DOWN
        //     input.html(cmdStack.down());
        //     e.preventDefault();
        // } else if (e.keyCode === 37) { // LEFT
            
        //     // e.preventDefault();
        // } else if (e.keyCode === 39) { // RIGHT
            
        //     // e.preventDefault();
        // }

        // console.log(input);
    }).on('keypress', e => {
        if (!cmdIsRunning) {
            let txt = input.html();
            input.html(txt + String.fromCharCode(e.charCode));
            // console.log(txt);
        }

    });
    
    // await writeLine(prefix + "echo Hello");
    // writeLine("Hello", 25);
});
