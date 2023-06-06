'use strict';

const path = require('path');
const AutoLoad = require('@fastify/autoload');

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

module.exports = async function (fastify, opts) {
	await fastify.register(require('@fastify/env'), {
		confKey: 'config',
		schema: {
			type: 'object',
			required: ['PORT', 'DB'],
			properties: {
				PORT: {
					type: 'string',
					default: 3000,
				},
				DB: {
					type: 'string',
				},
			},
		},
	});

	fastify.register(require('@fastify/cors'), (instance) => {
		return (req, callback) => {
			const corsOptions = {
				origin: true,
			};
			if (/^localhost$/m.test(req.headers.origin)) {
				corsOptions.origin = false;
			}
			callback(null, corsOptions);
		};
	});

	fastify.register(require('@fastify/mongodb'), {
		url: fastify.config.DB,
	});

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'plugins'),
		options: Object.assign({}, opts),
	});

	// This loads all plugins defined in routes
	// define your routes in one of these
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'routes'),
		options: Object.assign({}, opts),
	});
};
