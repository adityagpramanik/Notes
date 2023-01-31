require('dotenv').config()
const _ = require('lodash')
const cors = require('cors')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const express = require('express');
const async = require('async')
const jwt = require('jsonwebtoken')
const app = express()
const databaseServer = require('./services/dbService')
const authService = require('./services/authService')
const noteModel = require('./models/noteModel')
const userModel = require('./models/userModel')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
	origin: true, 
	credentials: true, exposedHeaders: ["set-cookie"],
}));
app.use(cookieParser());

databaseServer.start();

app.get('/api/v1/notes', authService, (req, res) => {
	let tags = req.query && req.query.tags || false;
	let query = {};

	if (tags && tags.length) {
		query['tags'] = {
			'$in': tags
		};
	}
	async.auto({
		notes: function (cb) {
			noteModel.find(query).exec(function (err, notes) {
				if (err) {
					return cb("Error fetching notes.");
				}
				return cb(null, notes);
			});
		},
	}, function (err, results) {
		if (err) {
			return res.json({error: err});
		}
		return res.json({count: results.notes.length, results: results.notes});
	});
});

app.post('/api/v1/new/note', (req, res) => {
	const note = req.body && req.body.note || false;
	var error = {};
	if (!note) {
		return res.status(403).json({error: "Invalid params, Note not found"});
	}
	if (!note.head) {
		error.head = "Head not found";
	}
	if (!note.body) {
		error.body = "body not found";
	}

	if (!_.isEmpty(error)) {
		console.log('error: ', error);
		return res.status(403).json({error: error});
	}
	async.auto({
		createNote: function (cb) {
			noteModel.create(note, function (err, note) {
				if (err) {
					return cb("Error creating document");
				}
				return cb(null, note)
			});
		}
	}, function (err, results) {
		if (err) {
			return res.json({error: err});
		}
		return res.json({info: 'Note created successfully.', results: results.createNote});
	});
});

app.get('/calculate', (req, res) => {
	const key = req.query && req.query.key || false;
	const a = req.query && req.query.a && parseFloat(req.query.a) || false;
	const b = req.query && req.query.b && parseFloat(req.query.b) || false;

	// const query = "select * from devices order by <column_name> offset <value> limit 5";
	let query = "select * from devices";
	const orderKey = req.query && req.query.orderKey || false;
	const offset = req.query && req.query.offset || false;
	const orderBy = req.query && req.query.orderBy || false;

	if (orderKey) {
		query = `${query} order by ${orderKey}`;
		if (orderBy) {
			query = `${query} ${orderBy}`;
		}
	}
	query = `${query} limit 5`;

	if (offset) {
		query = `${query} offset ${offset}`;
	}

	return res.send(query);

	if (!key) {
		return res.status(403).send("Unknown key!");
	}

	async.auto({
		add: function (cb) {
			if (key !== 'add') {
				return cb(null, false);
			}
			return cb(null, a+b);
		},

		sub: function (cb) {
			if (key !== 'sub') {
				return cb(null, false);
			}
			return cb(null, a-b);
		},
	}, function (err, results) {
		if (err) {
			return res.status(403).send("Invalid request");
		}

		return res.json({results: results[key]});
	});
});

app.post('/signup', (req, res) => {
	const email = req.body && req.body.email || false;
	const password = req.body && req.body.password || false;
	
	if (!email || !password) {
		res.status(403).send('Missing params.');
	}
	async.auto({
		hashPassword: function (cb) {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) {
						return cb(err);
					}
					return cb(null, hash);
				});
			})
		},
		createUser: ['hashPassword', function (results, cb) {
			const user = {
				email: email,
				password: results.hashPassword,
			};
			user.authToken = jwt.sign(user, process.env.AUTH_SECRET);
			userModel.create(user, (err, userDoc) => {
				if (err) {
					return cb(err);
				}

				return cb(null, userDoc.authToken);
			});
		}],
	}, (err, results) => {
		if (err) {
			return res.status(403).json({error: err});
		}

		return res.cookie("authToken", results.createUser, {httpOnly: false, domain: 'localhost',}).send('successfully registered');
	})
});

app.post('/login', (req, res) => {
	const email = req.body && req.body.email || false;
	const password = req.body && req.body.password || false;

	if (!email || !password) {
		return res.status(403).send("Missing params.");
	}

	async.auto({
		auth: (cb) => {
			userModel.findOne({email: email}).exec((err, user) => {
				if (err) {
					return cb(err);
				}
				if (!user || !user.authToken) {
					return cb('No user token found.');
				}
				return cb(null, user);
			});
		},
		checkPassword: ['auth', function (results, cb) {
			bcrypt.compare(password, results.auth.password).then((result) => {
				if (result) {
					try {
						const genToken = jwt.sign({email: results.auth.email, passowrd: results.auth.password}, process.env.AUTH_SECRET);
						return cb(null, genToken);
					} catch (err) {
						console.log(err);
					}

					return cb("Invalid credentials");
				}
				return cb("Invalid credentials");
			});
		}],
	}, (err, results) => {
		if (err) {
			return res.status(403).json({error: err});
		}

		return res.cookie("authToken", results.checkPassword, {
			httpOnly: false,
			domain: 'localhost',
			expires: new Date(Date.now() + (30*24*3600000))
		}).send('Login successful.');
	});
});

app.get('/logout', (req, res) => {
	return res.cookie("authToken", "", {
		httpOnly: false,
		domain: 'localhost',
		expires: new Date(0)
	}).send('Successfully logged out');
});

app.listen(process.env.API_PORT, () => {
	console.log(`\nServer has been started at http://localhost:${process.env.API_PORT}/\n`,);
})