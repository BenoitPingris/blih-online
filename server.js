const express = require('express');
const bodyParser = require('body-parser');
const Blih = require('blih');
const app = express();
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// I don't remember why I add this middleware but it's important lol
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/login', (req, res) => {
	const api = new Blih({ email: req.body.email, password: req.body.password});
	api.listRepositories()
		.then(data => {
			res.send(data);
	})
		.catch(err => {
			res.status(401);
			res.send({ error: err });

	});
});

app.post('/getacl', (req, res) => {
	const api = new Blih({ email: req.body.email, password: req.body.password});
	const repo = req.body.repo;

	if (repo === null || repo === undefined) {
		res.status(404).send('Repository not found');
	}
	api.getACL(repo)
	.then(data => res.send(data))
	.catch(err => res.status(404).send(err));
});

app.post('/setacl', (req, res) => {
	const api = new Blih({ email: req.body.email, password: req.body.password});
	const {
		user,
		repo
	} = req.body;
	const rights = convertRights(req.body.rights);

	console.log(user, repo, rights);

	if (user === undefined || user === null) {
		res.status(404).send('Repository not found');
	}
	api.setACL(repo, user, rights)
		.then(data => {console.log(data);res.send(data)})
		.catch(err => res.status(404).send(err));
});

app.listen(3000, () => {
    console.log('Server is listenning on port :3000');
});

function convertRights(right) {
	const mapRights = {
		'None': '',
		'Read': 'r',
		'Admin': 'a',
		'Read-Write': 'rw'
	};
	return mapRights[right];
}