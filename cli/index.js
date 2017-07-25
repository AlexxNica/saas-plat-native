require('babel-register');
var program = require('commander');

program.version('1.0.0');

program.command('build [entry]')
  .description('编译构建')
  .option('-o, --output <string>', '输出目录')
  .option('-w, --web', '构建web平台')
  .option('-a, --android', '构建安卓平台')
  .option('-i, --ios', '构建IOS平台')
  .option('-w, --windows', '构建Windows 10平台')
  .option('-m, --macos', '构建Mac平台')
  .action(require('./build'));

program.command('configKeyStore')
  .description('配置KeyStore')
  .option('-c, --config <string>', '配置文件')
  .option('-f, --file <string>', '文件路径')
  .option('-a, --alias <string>', '别名')
  .option('-p, --storePassword <string>', 'store密码')
  .option('-k, --keyPassword <string>', 'key密码')
  .action(require('./configKeystore'));

program.parse(process.argv); //开始解析用户输入的命令
