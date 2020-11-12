const models = require('../models');
const Domo = models.Domo;

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const makerPage = (req, res) => {
//   res.render('app');
	Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) =>
	{
		if (err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occurred.' });
		}
		return res.render('app', { domos: docs });
	});
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const makeDomo = (req, res) =>
{
	if (!req.body.name || !req.body.age) {
		return res.status(400).json({ error: 'Both age and name are required.' });
	}

	const domoData = {
		name: req.body.name,
		age: req.body.age,
		owner: req.session.account,
	};

	const newDomo = new Domo.DomoModel(domoData);

	const domoPromise = newDomo.save();

	domoPromise.then(() => res.json({ redirect: '/maker' }));

	domoPromise.catch((err) =>
	{
		console.log(err);
		if (err.code === 11000) {
			return res.status(400).json({ error: 'Domo already exists.' });
		}
		return res.status(400).json({ error: 'An error occurred.' });
	});

	return domoPromise;
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
