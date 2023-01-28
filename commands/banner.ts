import * as chalk from 'chalk';
import * as figlet from 'figlet';

figlet.text(process.argv[2], (error: any, data: any) => {
  if (error) {
    return process.exit(1);
  }

  console.log(chalk.blue(data));
  console.log(`V1.0 / ${process.argv[3]}`);
  console.log('');
  return process.exit(0);
});
