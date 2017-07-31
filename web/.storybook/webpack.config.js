var path = require('path');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');

const platform = 'web';

// Export a function. Accept the base config as the only param.
module.exports = function(storybookBaseConfig, configType) {
  // storybookBaseConfig.module.rules[0].exclude = [
  //   /node_modules\/(?!react-native-vector-icons|saas-plat-native-core)/,
  //   /\.less$/
  // ];
  storybookBaseConfig.module.rules.push({
    test: /\.less|\.css$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader'),
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
          plugins: () => [
            autoprefixer({
              browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
            }),
            pxtorem({ rootValue: 100, propWhiteList: [] })
          ],
        },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          modifyVars: { "@primary-color": "#1d4ba4" },
        },
      },
    ],
  });
  storybookBaseConfig.module.rules.push({
    test: /\.(svg)$/i,
    loader: 'svg-sprite-loader',
    include: [
      require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. svg files of antd-mobile
      // path.resolve(__dirname, 'src/my-project-svg-foler'),  // folder of svg files in your project
    ]
  });
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
  // console.log(storybookBaseConfig.plugins)
  // console.log(JSON.stringify(storybookBaseConfig,null,2)) Return the altered
  // config
  return storybookBaseConfig;
};
