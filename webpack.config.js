const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackConcatPlugin = require('webpack-concat-files-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack");

const fontawesome = require(path.resolve(__dirname, 'src/fontawesome.json'));

try {
  require(fontawesome.pro.directory);

  fontawesome.usage = 'pro'
} catch (error) {
  try {
    require(fontawesome.free.directory);

    fontawesome.usage = 'free'
  } catch (error) {}
}

if (fontawesome.usage === 'free') {
  console.log("No Font Awesome Pro use, switch to free instead");
} else if (fontawesome.usage === '') {
  console.log("Font Awesome is not installed!");
}

const vendor = [
  ...fontawesome[fontawesome.usage].styles
]

const config = {
  stats: 'errors-only',

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },

  entry: {
    customer: [
      './src/scripts/customer.js',
      './src/styles/customer.scss'
    ],
    vendor
  },

  externals: {
    hammerjs: 'hammerjs',
    jquery: 'jQuery'
  },

  output: {
    chunkFilename: 'js/[name].js',
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'static')
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // new WebpackConcatPlugin({
    //   bundles: [
    //     {
    //       destination: 'static/js/vendor.js'
    //     },
    //   ],
    // }),
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: [
        'css/cloudsuite.css', 'css/vendor.css', 'css/styleguide.css',
        'js/cloudsuite.js', 'vendor.js', 'vendor.js*',
        'img/**/*',
        'webfonts/**/*'
      ],
    }),
    Autoprefixer,
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyPlugin([
      {
        from: 'src/images',
        to: 'img',
        test: /\.(jpe?g|png|gif|svg)$/i,
        force: true
      }, {
        from: fontawesome[fontawesome.usage].fonts,
        to: 'webfonts'
      }
    ]),
    new ImageminPlugin({
      bail: false,
      cache: true,
      name: "[path][name].[ext]",
      imageminOptions: {
        plugins: [
          ["gifsicle", {interlaced: true}],
          ["jpegtran", {progressive: true}],
          ["optipng", {optimizationLevel: 5}],
          [
            "svgo",
            {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            }
          ]
        ]
      }
    }),
    new RemovePlugin({
      after: {
        include: [
          'static/js/fonts.js',
          'static/js/fonts.js.map'
        ],
      }
    })
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src/scripts')],
        exclude: [
          '/node_modules/',
          path.resolve(__dirname, 'static/vendor')
        ],
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true
        }
      }, {
        test: /.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src/scripts')],
        exclude: [
          '/node_modules/',
          path.resolve(__dirname, 'static/vendor')
        ]
      }, {
        test: /.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            }
          }, {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[name].[ext]',
              outputPath: 'img/'
            }
          }
        ]
      }, {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'webfonts/'
            }
          }
        ]
      }
    ]
  },

  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: {
        condition: 'some',
        filename: (fileData) => {
          return `${fileData.filename}.LICENSE.txt${fileData.query}`;
        },
        banner: (licenseFile) => {
          return `License information can be found in ${licenseFile}`;
        }
      }
    })],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },
  devServer: {
    publicPath: '/static/',
    contentBase: './templates/',
    watchContentBase: true,
  },
  devtool: 'source-map'
}

module.exports = (env, argv) => config;
