const program = require('commander');
const shell = require('shelljs')
const vite = require('vite')
program.command('start <port>')
	.action((port = 8989) => {
    console.log(port, 'port')
    process.env.SERVER_PORT = port
    shell.exec(`npm run serve`, function(error, stdout, stderr) {
      console.log(error);
    })
	})

program.parse(process.argv);