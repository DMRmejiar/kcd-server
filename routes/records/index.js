'use strict';

module.exports = async function (fastify, opts) {
	fastify.post('/', async function (request, reply) {
		const image = request.body.image;
		if (!image) throw new Error('MISSING_PARAMS');
		const patientExists = this.validateUser(image);
		if (!patientExists) throw new Error('USER_NOT_FOUND');
		const patientId = new this.mongo.ObjectId(patientExists);
		const patients = this.mongo.db.collection('patients');
		const records = this.mongo.db.collection('records');
		let data = {};
		try {
			const patient = await patients.findOne({
				_id: patientId,
			});
			if (!patient) throw new Error('PATIENT_NOT_FOUND');
			data = {
				name: patient.name,
				document: patient.document,
				documentType: patient.documentType,
				history: [],
			};
			data.history = await records
				.aggregate([
					{ $match: { patient: patientId } },
					{ $sort: { _id: -1 } },
					{
						$lookup: {
							from: 'physicians',
							localField: 'physician',
							foreignField: '_id',
							as: 'physician',
						},
					},
					{ $unwind: { path: '$physician' } },
					{
						$project: {
							message: 1,
							createdAt: 1,
							physician: '$physician.name',
						},
					},
				])
				.toArray();
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
		return data;
	});
	fastify.put('/:id', async function (request, reply) {
		const body = request.body;
		if (!body || !body.physician || !body.message)
			throw new Error('MISSING_PARAMS');
		const records = this.mongo.db.collection('records');
		const physicians = this.mongo.db.collection('physicians');
		const patients = this.mongo.db.collection('patients');
		const physicianId = new this.mongo.ObjectId(body.physician);
		const patientId = new this.mongo.ObjectId(request.params.id);
		try {
			const physician = await physicians.findOne({
				_id: physicianId,
			});
			if (!physician) throw new Error('PHYSICIAN_NOT_FOUND');
			const patient = await patients.findOne({
				_id: patientId,
			});
			if (!patient) throw new Error('PATIENT_NOT_FOUND');
			await records.insertOne({
				patient: patientId,
				physician: physicianId,
				createdAt: new Date().toJSON(),
				message: body.message,
			});
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
		return {
			message: 'ok',
		};
	});
};
