import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { LOGGED_IN_USER } from './config';
import { User } from './models/user';
import { Video } from './models/video';
import { VideoActivityResource } from './resources/video-activity';
import { VideoActivityPostRequest } from './requests/video-activity-post';
import { VideoPatchRequest } from './requests/video-patch';
import { VideoDbService } from './db/video-db-service';
import { UserDbService } from './db/users-db-service';
import { VideoActivityDbService } from './db/video-activity-db-service';
import { MODEL_FACTORY as ModelFactory } from './model-factory';
import { RESOURCE_FACTORY as ResourceFactory } from './resource-factory'; 
import { simulateDelay } from './helpers';

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json({limit: '50mb'}));

const PORT = process.env.PORT || 3000;
const videoService = new VideoDbService();
const userService = new UserDbService();
const videoActivityService = new VideoActivityDbService();

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get('/status', (request, response) => {
    const status = {
       'Status': 'Running'
    };
    response.send(status);
});

app.get('/users/self', (req, res) => {
    res.send(LOGGED_IN_USER)
});

app.get('/videos', (req, res) => {
    const videoResources = videoService.getVideos();
    const results = new Array<Video>();
    for ( let item of videoResources ) {
        results.push(new Video(
            item.id,
            item.title,
            item.description,
            item.createdDate,
            LOGGED_IN_USER,
            item.url
        ));
    }

    simulateDelay(() => {
        res.send(results);
    });
});

app.get('/videos/:videoId', (req, res) => {
    const videoId = req.params.videoId;

    const videosData = videoService.getVideos();
    const foundIndex = videosData.findIndex(t => t.id === videoId);
    const videoResource = videosData[foundIndex];

    if (!videoResource) {
        res.status(404).send();
        return;
    }

    const result = ModelFactory.videoResourceToVideo(videoResource, userService);

    simulateDelay(() => {
        res.send(result);
    });
});

app.patch('/videos/:videoId', (req, res) => {
    const videoId = req.params.videoId;
    const requestItem = req.body as VideoPatchRequest;

    const videosData = videoService.getVideos();
    const foundIndex = videosData.findIndex(t => t.id === videoId);
    const videoResource = videosData[foundIndex];

    if (!videoResource) {
        res.status(404).send();
        return;
    }

    let didChanged = false;

    if ( requestItem.title !== undefined && requestItem.title !== null ) {
        if ( videoResource.title !== requestItem.title ) {
            didChanged = true;
        }
        videoResource.title = requestItem.title;
    }

    if ( requestItem.description !== undefined && requestItem.description !== null ) {
        if ( videoResource.description !== requestItem.description ) {
            didChanged = true;
        }
        videoResource.description = requestItem.description;
    }

    if ( didChanged ) {
        videosData[foundIndex] = videoResource;
        videoService.saveVideos(videosData);
    }

    const result = ModelFactory.videoResourceToVideo(videoResource, userService);
    
    res.send(result);
});

app.get('/videos/:videoId/activity', (req, res) => {
    const videoId = req.params.videoId;

    const videoResources = videoService.getVideos();
    const videoResource = videoResources.find(t => t.id === videoId);

    if (!videoResource) {
        res.status(404).send();
        return;
    }

    const _activitiesData = videoActivityService.getVideoActivities();
    const activitiesData = _activitiesData.filter(t => t.videoId === videoId);
    const authorsData = userService.getUsers();

    const results = ModelFactory.videoActivityResourceToVideoActivity(
        activitiesData,
        videoResource,
        authorsData
    );

    res.send(results);
});


app.post('/videos/:videoId/activity', (req, res) => {

    const videoId = req.params.videoId;
    const requestItem = req.body as VideoActivityPostRequest;

    const videoResources = videoService.getVideos();
    const videoResource = videoResources.find(t => t.id === videoId);

    if (!videoResource) {
        res.status(404).send();
        return;
    }

    const _activitiesData = videoActivityService.getVideoActivities();
    const activitiesData = _activitiesData.filter(t => t.videoId === videoId);
    const authorsData = userService.getUsers();

    const authorResource = authorsData.find( t => t.id == requestItem.authorId )!;
    const author = new User(
        authorResource.id,
        authorResource.name,
        authorResource.pictureUrl
    );
    
    let resourceItem: VideoActivityResource;

    try {
        resourceItem = ResourceFactory.buildVideoActivityResource(
            requestItem,
            videoResource,
            author
        );
    } catch (e) {
        res.status(400).send((e as Error).message);
        return;
    }

    activitiesData.push(resourceItem);
    videoActivityService.saveVideoAcivity(activitiesData);

    const results = ModelFactory.videoActivityResourceToVideoActivity(
        activitiesData,
        videoResource,
        authorsData
    );

    res.send(results);
});
