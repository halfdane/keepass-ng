module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['browserify', 'mocha', 'chai-dom', 'chai-sinon'],

        browsers: ['PhantomJS'],
        singleRun: true,

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'src/spec/test-fakes.js',
            'src/spec/**/*-Spec.js'
        ],

        preprocessors: {
            'src/spec/**/*.js': ['browserify']
        },
        browserify: {
            debug: true,
            transform: ["babelify"],
            plugin: ['proxyquire-universal']
        },

        colors: true,
        reporters: ['mocha']
    });
};
