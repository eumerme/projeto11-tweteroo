import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post('/sign-up', (req, res) => {
    const { username, avatar } = req.body;
    const usernameExists = users.some(user => user.username === username);

    if (usernameExists) {
        return res.status(400).send({ error: 'Nome de usuário já cadastrado!' });
    };

    if (!username || !avatar) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios!' });
    };

    users.push({
        username,
        avatar
    });

    res.status(201).send(users);
});

app.post('/tweets', (req, res) => {
    const { username, tweet } = req.body;
    const userpic = users.find(user => user.username === username);

    if (!username || !tweet) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios!' });
    };

    tweets.push({
        username,
        avatar: userpic.avatar,
        tweet
    });

    res.status(201).send(tweets);
});

app.get('/tweets', (req, res) => {
    res.send(tweets.slice(-10).reverse());
});

app.get('/tweets/:username', (req, res) => {
    const { username } = req.params;
    const userTweets = tweets.filter(userTweets => userTweets.username === username);
    res.send(userTweets);
});

app.listen(5000, () => console.log('Listening on 5000'));