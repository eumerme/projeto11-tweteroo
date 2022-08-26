import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let user = {};
const tweets = [];

app.post('/sign-up', (req, res) => {
    const userInfo = req.body;
    user = { ...userInfo };
    res.send(user);
});

app.post('/tweets', (req, res) => {
    const tweet = req.body;
    tweets.push({
        ...tweet,
        avatar: user.avatar,
    });
    res.send(tweets);
});

app.get('/tweets', (req, res) => {
    res.send(tweets.slice(-10).reverse());
});

app.listen(5000, () => console.log('Listening on 5000'));