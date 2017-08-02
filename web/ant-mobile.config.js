var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');

module.exports = function(config){
  config.resolve.extensions.push(/\.less$/);
  config.resolve.extensions.push(/\.svg$/);
  // config.module.rules[0].exclude.push(
  //   /\.less$/
  // );
  //config.babel.plugins.push(['import', { libraryName: 'antd-mobile', style: 'css' }]);
  config.module.loaders.push({
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
            modifyVars: { '@primary-color': '#1d4ba4' },
          },
        },
      ],
    });
    config.module.loaders.push({
      test: /\.(svg)$/i,
      loader: 'svg-sprite-loader',
      include: [
        require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. svg files of antd-mobile
        // path.resolve(__dirname, 'src/my-project-svg-foler'),  // folder of svg files in your project
      ]
    });
};
