const shell = require("shelljs");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const argv = require("./argv");

const { version, tag = "latest" } = argv;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const execAsyncEndTasks = [];

if (version) {
  const execBuildTask = () => execAsync("npm run build", "execBuildTask");
  const execVersionTask = () =>
    execAsync(`npm version ${version} -m "chore: version %s"`, "execVersionTask");
  const execPackageJsonTask = () => {
    const packageJson = require("../package.json");
    const pkg = JSON.parse(JSON.stringify(packageJson));
    Reflect.deleteProperty(pkg, "devDependencies");
    Reflect.deleteProperty(pkg, "husky");
    Reflect.deleteProperty(pkg, "scripts");
    Reflect.deleteProperty(pkg, "lint-staged");
    const distPath = resolveApp("dist");
    fs.writeFileSync(`${distPath}/package.json`, JSON.stringify(pkg, null, 2), {
      encoding: "utf-8",
    });
  };
  const execCopyTask = () => {
    shell.cp("README.md", "dist");
  };
  const execNpmConfigTask = () => execAsync("npm config get registry", "execNpmConfigTask");
  const execPublishTask = () =>
    execAsync(`npm publish --access=public dist --tag ${tag}`, "npmRegistry");
  const execSyncTaoBaoTask = () =>
    execAsync(
      "curl -X PUT https://npm.taobao.org/sync/kzf-business-components",
      "execSyncTaoBaoTask"
    );
  const execPushTagTask = () => execAsync("git push --follow-tags", "execPushTagTask");
  execBuildTask()
    .then(execVersionTask)
    .then(execPackageJsonTask)
    .then(execCopyTask)
    .then(execNpmConfigTask)
    .then(execPublishTask)
    .then(execSyncTaoBaoTask)
    .then(execPushTagTask)
    .then(() => {
      console.log("发布成功".green);
    })
    .finally(() => {
      if (execAsyncEndTasks.length > 0) {
        execAsyncEndTasks.forEach((task) => {
          task();
        });
      }
    })
    .catch((err) => {
      console.log(colors.red(err));
      process.exit(1);
    });
} else {
  console.error(colors.red("未指定version参数"));
}

function execAsync(command, execLog) {
  return new Promise((resolve, reject) => {
    const child = shell.exec(command, { async: true });
    console.log(`${execLog} start`.green);
    child.stdout.on("data", function (data) {
      console.log(`${execLog} stdout ${data}`.yellow);
      if (execLog === "execNpmConfigTask" && !data.includes("registry.npmjs.org/")) {
        shell.exec("npm config set registry=https://registry.npmjs.org/");
        execAsyncEndTasks.push(() => shell.exec(`npm config set registry=${data}`));
      }
    });
    child.on("close", function (code) {
      if (code === 0) {
        console.log(`${execLog} end`.green);
        resolve();
      } else {
        const error = `${execLog} fail`.red;
        reject(error);
      }
    });
  });
}
