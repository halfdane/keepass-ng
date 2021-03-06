module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['browserify', 'mocha', 'chai-dom', 'chai-sinon', 'chai-as-promised', 'chai'],

        browsers: ['PhantomJS'],
        singleRun: true,

        files: [
            'src/spec/phantomJs/test-fakes.js',
            'src/spec/phantomJs/**/*-Spec.js'
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
