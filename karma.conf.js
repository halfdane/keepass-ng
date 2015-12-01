module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['browserify', 'mocha', 'chai-dom', 'sinon-chai'],

        browsers: ['PhantomJS'],
        singleRun: true,

        files: [
                'src/spec/test-fakes.js',
                'src/spec/**/*-Spec.js'
        ],

        preprocessors: {
            'src/spec/**/*.js': ['browserify']
        },
        browserify: {
            debug: true,
            transform: [
                "babelify"
            ]
        },

        logLevel: 'LOG_INFO',
        colors: true,
        reporters: ['mocha', 'coverage']
    });
};
