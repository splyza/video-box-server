import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { ApiRouter } from './api';

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/api', ApiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


