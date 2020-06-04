import md from '@jupyterlab/markdownviewer-extension';

// TODO: have a remote entry point from jlab itself that I can import and
// register myself with, rather than relying on coordination via a global
// array.
window.JLAB_PLUGINS = window.JLAB_PLUGINS || [];
window.JLAB_PLUGINS.push(md);

// export default md;
