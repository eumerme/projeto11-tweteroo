import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let user = {};

app.post('/sign-up', (req, res) => {
    const userInfo = req.body;
    user = { ...userInfo };
    res.send(user);
});

app.listen(5000, () => console.log('Listening on 5000'));