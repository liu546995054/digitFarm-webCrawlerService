const fs = require('fs')
const child_process = require('child_process')
const { log } = console
const schedule = require('node-schedule')

// windows与其它系统调用方式不同
const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

//定时任务执行状态位，执行中时则不进行再次执行
let runStatus = false

// 下面三行是获取package.json中需要执行的代码，可根据自己的需求进行调整
const myreg = /^'sf-juejin':/
const packageJsonData = JSON.parse(fs.readFileSync('../package.json', 'utf8'))
const cmds = Object.keys(packageJsonData.scripts).filter(item => item == 'sf-juejin')
console.log('cmds',packageJsonData)
console.log('cmds',cmds)
let date = new Date(2024, 6, 23, 22, 30, 0);
let rule = new schedule.RecurrenceRule();
rule.minute = 10;
rule.second = 0;
//每10秒执行一次
schedule.scheduleJob('0 0 8 * * *', function () {
    // log('定时任务开始执行')

        let i = 0
        const run = () => {
           child_process.spawn(cmd, ['run', cmds[i]], { stdio: 'inherit' })
            // stdio子进程的标准输入输出配置,'inherit'：通过相应的标准输入输出流传入/传出父进程

        }
        run()
})