// 生成 ios的本地包

var spawnSync = require('child_process').spawnSync;
var arguments = process.argv.splice(2);

if (arguments.indexOf('--android') > -1) {
  console.log('android->');
  console.log(spawnSync("node", [
    "node_modules/react-native/local-cli/cli.js",
    "bundle",
    "--entry-file",
    "index.android.js",
    "--bundle-output",
    "../android/app/src/main/assets/index.android.jsbundle",
    "--platform",
    "android",
    "--assets-dest",
    "../android/app/src/main/res/",
    "--dev",
    false
  ]).stdout.toString());
}
if (arguments.indexOf('--ios') > -1) {
  console.log('ios->');
  console.log(spawnSync("node", [
    "node_modules/react-native/local-cli/cli.js",
    "bundle",
    "--entry-file",
    "index.ios.js",
    "--bundle-output",
    "../ios/main.jsbundle",
    "--platform",
    "ios",
    "--assets-dest",
    "../ios/Saasplat/Images.xcassets/",
    "--dev",
    false
  ]).stdout.toString());
}

if (arguments.indexOf('--web') > -1) {

}

if (arguments.indexOf('--windows') > -1) {
    console.log('ios->');
    console.log(spawnSync("node", [
      "node_modules/react-native/local-cli/cli.js",
      "bundle",
      "--entry-file",
      "index.windows.js",
      "--bundle-output",
      "../windows/myapp/ReactAssets/index.windows.bundle",
      "--platform",
      "windows",
      "--assets-dest",
      "../windows/myapp/ReactAssets",
      "--dev",
      false
    ]).stdout.toString());
}


if (arguments.indexOf('--macos') > -1) {

}
