const webpack = require('webpack'),
	path = require('path'),
	nodeExternals = require('webpack-node-externals');

const APP_DIR = path.resolve(__dirname, 'src/jsx');

const config = {
	target: 'node-webkit',
	entry: path.join(APP_DIR, 'app.jsx'),
	output: {
		path: path.resolve(__dirname, 'src/build'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				include: APP_DIR,
				loader: 'babel-loader'
			}
		]
	},
	externals: [nodeExternals()]
};

module.exports = config;