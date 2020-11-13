const models = require('../models');

const { Account } = models;
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const loginPage		= (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const signupPage	= (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const logout		= (req, res) => {
	req.session.destroy();
  res.redirect('/');
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const login			= (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
	}
	
	req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const signup		= (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
		req.session.account = Account.AccountModel.toAPI(account);
		return res.json({ redirect: '/maker' });
	});

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

module.exports.loginPage	= loginPage;
module.exports.login		= login;
module.exports.logout		= logout;
module.exports.signupPage	= signupPage;
module.exports.signup		= signup;
