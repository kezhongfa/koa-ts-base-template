const colors = require("colors");
const compareVersions = require("compare-versions");
const packageJson = require("../package.json");

function checkDependencies(mappings, theRequire) {
  const unexpects = Object.keys(mappings).reduce((assc, dependency) => {
    const targetVersion = mappings[dependency];
    try {
      const { version } = theRequire(`${dependency}/package.json`);
      const target = targetVersion.replace(/[\^\=\~]/, "");

      // 依赖版本太低
      if (compareVersions(version, target) === -1) {
        assc[dependency] = {
          error: 1,
          version,
          targetVersion,
        };
      }
    } catch (err) {
      // 缺少依赖
      assc[dependency] = { error: 2, targetVersion };
    }

    return assc;
  }, {});

  if (Object.keys(unexpects).length > 0) {
    console.log(
      colors.red(`系统检测到以下依赖未安装或版本太低，请重新安装：\n`)
    );

    Object.keys(unexpects).forEach((dep) => {
      console.log(
        colors.bold(colors.green(`${dep}@${unexpects[dep].targetVersion}`)),
        unexpects[dep] === 1 ? colors.yellow("版本太低") : colors.red("未安装")
      );
    });

    console.log(`\n请执行 ${colors.green("npm run install")} 重新安装依赖\n`);

    // 退出程序
    process.exit(1);
  }
}

const dependencies = {
  ...packageJson.devDependencies,
  ...packageJson.dependencies,
};

checkDependencies(dependencies, require);
