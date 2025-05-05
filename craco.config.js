// craco.config.js
module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.optimization.minimize = false;
            return webpackConfig;
        },
    },
};
