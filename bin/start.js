const colors = require('colors');
const prompts = require('prompts');
const child_process = require('child_process');

(async () => {
  const response = await prompts({
    type: 'select',
    name: 'service',
    message: '请选择需要启动的服务',
    choices: [
      {
        title: `开发: ${colors.green('npx nodemon')}`,
        value: 'npx nodemon',
      },
      {
        title: `打包编译: ${colors.green('npm run build')}`,
        value: 'npm run build',
      },
      {
        title: `代码检查: ${colors.green('npm run codecheck')}`,
        value: 'npm run codecheck',
      },
    ],
  });

  if (response.service) {
    child_process.execSync(response.service, {
      stdio: 'inherit',
    });
  }
})();
