'use strict';
const fp = require('fastify-plugin');

module.exports = fp(async function (fastify, opts) {
	fastify.decorate('validateUser', function (image) {
		return '647edfbe46bf470a1a36192e';
	});
});
