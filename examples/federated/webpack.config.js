// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
const data = require('./package.json');
const Build = require('@jupyterlab/buildutils').Build;
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const ContainerPlugin = require('webpack/lib/container/ContainerPlugin');
const path = require('path');

const names = Object.keys(data.dependencies).filter(function(name) {
  const packageData = require(name + '/package.json');
  return packageData.jupyterlab !== undefined;
});

const extras = Build.ensureAssets({
  packageNames: names,
  output: './build'
});

const rules = [
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  { test: /\.html$/, use: 'file-loader' },
  { test: /\.md$/, use: 'raw-loader' },
  { test: /\.(jpg|png|gif)$/, use: 'file-loader' },
  { test: /\.js.map$/, use: 'file-loader' },
  {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url-loader?limit=10000&mimetype=application/octet-stream'
  },
  { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
  {
    // In .css files, svg is loaded as a data URI.
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    issuer: /\.css$/,
    use: {
      loader: 'svg-url-loader',
      options: { encoding: 'none', limit: 10000 }
    }
  },
  {
    // In .ts and .tsx files (both of which compile to .js), svg files
    // must be loaded as a raw string instead of data URIs.
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    issuer: /\.js$/,
    use: {
      loader: 'raw-loader'
    }
  }
];

const options = {
  devtool: 'source-map',
  bail: true,
  mode: 'development'
};

module.exports = [
  {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      library: 'jupyterlab',
      libraryTarget: 'amd',
      filename: 'bundle.js',
      publicPath: '/foo/static/example/'
    },
    stats: 'verbose',
    ...options,
    module: { rules },
    plugins: [
      new ModuleFederationPlugin({
        name: 'main',
        library: { type: 'amd', name: 'main' },
        remotes: {
          markdownviewer_extension: 'markdownviewer_extension'
        },
        shared: {
          [`@jupyterlab/application-2`]: '@jupyterlab/application',
          [`@jupyterlab/rendermime-2`]: '@jupyterlab/rendermime',
          ['@jupyterlab/settingregistry-2']: '@jupyterlab/settingregistry'
        }
      }),
      new webpack.DefinePlugin({
        'process.env': '{}',
        process: {}
      })
    ]
  },
  {
    entry: './index-md.js',
    output: {
      filename: 'extension.js',
      path: path.resolve(__dirname, 'build', 'mdext'),
      publicPath: '/foo/static/example/mdext/'
    },
    ...options,
    module: { rules },
    plugins: [
      new ContainerPlugin({
        name: 'markdownviewer_extension',
        library: { type: 'amd', name: 'markdownviewer_extension' },
        filename: 'remoteEntry.js',
        exposes: {
          index: './index-md.js'
        },
        overridables: {
          [`@jupyterlab/application-2`]: '@jupyterlab/application',
          [`@jupyterlab/rendermime-2`]: '@jupyterlab/rendermime',
          ['@jupyterlab/settingregistry-2']: '@jupyterlab/settingregistry'
        }
      }),
      new webpack.DefinePlugin({
        'process.env': '{}',
        process: {}
      })
    ]
  }
].concat(extras);
