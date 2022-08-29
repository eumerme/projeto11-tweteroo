import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];
let currentPage = 1;
let minLoad = 0;
let maxLoad = 10;

app.post('/sign-up', (req, res) => {
    const { username, avatar } = req.body;
    const usernameExists = users.some(user => user.username === username);
    const validAvatar = avatar.substring(0, 7) === "http://" || avatar.substring(0, 8) === "https://";

    if (usernameExists) {
        return res.status(400).send('Nome de usuário já cadastrado!');
    };

    if(!validAvatar) {
        return res.status(401).send('Informe uma imagem válida!');
    };

    if (!username || !avatar) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    };

    users.push({
        username,
        avatar
    });

    res.status(201).send(users);
});

app.post('/tweets', (req, res) => {
    const { user: username } = req.headers;
    const { tweet } = req.body;
    const _user = users.find(user => user.username === username);

    if (!username || !tweet) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    };

    tweets.unshift({
        username,
        avatar: _user.avatar,
        tweet
    });

    res.status(201).send(tweets);
});

app.get('/tweets', (req, res) => {
    const page = Number(req.query.page);

    if (!page || page < 1) {
        return res.status(400).send('Informe uma página válida!');
    };

    if (currentPage !== page) {
        currentPage = page;
        minLoad += 10;
        maxLoad += 10;
    };

    if (page === 1) {
        minLoad = 0;
        maxLoad = 10;
    };

    res.send(tweets.slice(minLoad, maxLoad));
});

app.get('/tweets/:username', (req, res) => {
    const { username } = req.params;
    res.send(tweets.filter(userTweets => userTweets.username === username));
});

app.listen(5000, () => console.log('Listening on 5000'));