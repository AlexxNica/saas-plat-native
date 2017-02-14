// 生成 ios的本地包


var spawnSync = require('child_process').spawnSync;

// console.log('android->');
// console.log(spawnSync("node", [
//   "node_modules/react-native/local-cli/cli.js",
//   "bundle",
//   "--entry-file", "index.android.js",
//   "--bundle-output",
//   "./android/app/src/main/assets/index.android.jsbundle",
//   "--platform",
//   "android",
//   "--assets-dest",
//   "./android/app/src/main/res/",
//   "--dev",
//   false
// ]).stdout.toString());

console.log('ios->');
console.log(spawnSync("node", ["node_modules/react-native/local-cli/cli.js",
  "bundle",
  "--entry-file",
  "index.ios.js",
  "--bundle-output",
  "./ios/main.jsbundle",
  "--platform",
  "ios",
  "--assets-dest",
  "./ios/Saasplat/Images.xcassets/",
  "--dev",
  false
]).stdout.toString());
