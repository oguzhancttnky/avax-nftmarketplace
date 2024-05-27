module.exports = function override(config) {
    // Fallbacks for Node.js core modules and others
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "stream": require.resolve("stream-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify")
    };

    return config;
};
