import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { LOGGED_IN_USER } from './config';
import { VideoPreview } from './models/video';
import { VideoReactionResource } from './resources/video-reaction';
import { VideoReactionPostRequest } from './requests/video-reaction-post';
import { VideoPatchRequest } from './requests/video-patch';
import { VideoDbService } from './db/video-db-service';
import { UserDbService } from './db/users-db-service';
import { VideoReactionDbService } from './db/video-reaction-db-service';
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
const videoReactionService = new VideoReactionDbService();

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
    const results = new Array<VideoPreview>();

    for ( let item of videoResources ) {
        results.push({
            id: item.id,
            title: item.title,
            createdDate: item.createdDate,
            author: LOGGED_IN_USER
        });
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

app.get('/videos/:videoId/reactions', (req, res) => {
    const videoId = req.params.videoId;

    const videoResources = videoService.getVideos();
    const videoResource = videoResources.find(t => t.id === videoId);

    if (!videoResource) {
        res.status(404).send();
        return;
    }

    const _activitiesData = videoReactionService.getVideoReactions();
    const activitiesData = _activitiesData.filter(t => t.videoId === videoId);
    const authorsData = userService.getUsers();

    const results = ModelFactory.videoReactionResourceToVideoReactionPreview(
        activitiesData,
        videoResource,
        authorsData
    );

    res.send(results);
});


app.post('/videos/:videoId/reactions', (req, res) => {

    const videoId = req.params.videoId;
    const requestItem = req.body as VideoReactionPostRequest;

    const videoResources = videoService.getVideos();
    const videoResource = videoResources.find(t => t.id === videoId);

    if ( !videoResource ) {
        res.status(404).send();
        return;
    }

    if ( videoResource.authorId !== LOGGED_IN_USER.id ) {
        res.status(403).send();
        return;
    }

    let resourceItem: VideoReactionResource;

    try {
        resourceItem = ResourceFactory.buildVideoReactionResource(
            requestItem,
            videoResource,
            LOGGED_IN_USER
        );
    } catch (e) {
        res.status(400).send((e as Error).message);
        return;
    }

    const _activitiesData = videoReactionService.getVideoReactions();
    const activitiesData = _activitiesData.filter(t => t.videoId === videoId);
    const authorsData = userService.getUsers();

    activitiesData.push(resourceItem);
    videoReactionService.saveVideoReaction(activitiesData);

    const results = ModelFactory.videoReactionResourceToVideoReactionPreview(
        activitiesData,
        videoResource,
        authorsData
    );

    res.send(results);
});
