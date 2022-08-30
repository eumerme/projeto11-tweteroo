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
    const validAvatar = avatar.startsWith('http://') || avatar.startsWith('https://');

    if (!username || !avatar) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    if (usernameExists) {
        return res.status(400).send('Nome de usuário já cadastrado!');
    }

    if (!validAvatar) {
        return res.status(401).send('Informe uma imagem válida!');
    }

    users.push({
        username,
        avatar
    });

    res.status(201).send(users);
});

app.post('/tweets', (req, res) => {
    const { user: username } = req.headers;
    const { tweet } = req.body;
    const userValidation = users.some(user => user.username === username);
    
    if (!username || !tweet) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    if(!userValidation) {
        return res.status(400).send('Usuário não cadastrado!');
    }

    tweets.unshift({
        username,
        tweet
    });

    res.status(201).send(tweets);
});

app.get('/tweets', (req, res) => {
    const page = Number(req.query.page);
    
    if (!page || page < 1) {
        return res.status(400).send('Informe uma página válida!');
    }

    const limit = 10;
    const minLoad = (page - 1) * limit;
    const maxLoad = page * limit;

    tweets.forEach(tweet => {
        const { avatar } = users.find(user => user.username === tweet.username);
        tweet.avatar = avatar;
    });

    res.send(tweets.slice(minLoad, maxLoad));
});

app.get('/tweets/:username', (req, res) => {
    const { username } = req.params;
    res.send(tweets.filter(userTweets => userTweets.username === username));
});

app.listen(5000, () => console.log('Listening on 5000'));