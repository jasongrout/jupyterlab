import md from '@jupyterlab/markdownviewer-extension';

// TODO: have a remote entry point from jlab itself that I can import and
// register myself with, rather than relying on coordination via a global
// array. It does seem that there will need to be some kind of coordination,
// though, since the code below runs asynchronously and may run after the app
// is initialized.

// const name = '@jupyterlab/markdownviewer-extension';
// const plugins = window.JLAB_PLUGINS = window.JLAB_PLUGINS || new Map();
// if (plugins.has(name)) {
//   const pluginPromise = plugins.get(name);
//   pluginPromise.resolve(md);
// } else {
//   plugins.set(name, new Promise(resolve => { resolve(md); }));
// }

export default md;
