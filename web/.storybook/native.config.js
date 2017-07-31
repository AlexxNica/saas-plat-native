var path = require('path');
var platform = 'web';

module.exports = function(storybookBaseConfig){
  storybookBaseConfig.module.rules[0].exclude = [
    /node_modules\/(?!react-native-vector-icons)/
  ];
  storybookBaseConfig.module.rules.push({
    test: /\.(eot?|woff?|woff2?|ttf?|svg?|png?|jpg?|gif?)/,
    loader: 'url-loader?limit=8192&name=[name].[ext]',
    include: path.resolve(__dirname, "../node_modules/react-native-vector-icons")
  });
  storybookBaseConfig.node = {
    fs: 'empty'
  };
  storybookBaseConfig.resolve.alias = {
    'saasplat-native': 'saas-plat-native-core',
    'react-native': 'react-native-web'
  };
  storybookBaseConfig.resolve.extensions = [
    '.' + platform + '.js',
    '.js',
    '.css',
    '.less',
    '.png',
    '.svg'
  ];
  storybookBaseConfig.plugins[0].definitions['__DEV__'] = true;
}
