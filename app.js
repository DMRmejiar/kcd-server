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
			required: [
				'PORT',
				'DB',
				'POLYGON_ADDRESS_CONTRACT',
				'POLYGON_ADDRESS_USER',
				'POLYGON_PRIVATE_KEY',
				'WEB3_URL',
				'AWS_KEY_ID',
				'AWS_ACCESS_KEY',
				'AWS_REGION',
				'AWS_COLLECTION',
			],
			properties: {
				PORT: {
					type: 'string',
					default: 3000,
				},
				DB: { type: 'string' },
				POLYGON_ADDRESS_CONTRACT: { type: 'string' },
				POLYGON_ADDRESS_USER: { type: 'string' },
				POLYGON_PRIVATE_KEY: { type: 'string' },
				WEB3_URL: { type: 'string' },
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

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'plugins'),
		options: Object.assign({}, opts),
	});

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'routes'),
		options: Object.assign({}, opts),
	});
};
