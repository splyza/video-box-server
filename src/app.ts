import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { ApiRouter } from './api';
import { PORT } from './config';

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/api', ApiRouter);

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


