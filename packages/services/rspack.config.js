/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const version = require('./package.json').version;

export default {
  entry: './lib',
  output: {
    filename: './dist/index.js',
    library: '@jupyterlab/services',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: 'https://unpkg.com/@jupyterlab/services@' + version + '/dist/'
  },
  bail: true,
  mode: 'production',
  devtool: 'source-map'
};
