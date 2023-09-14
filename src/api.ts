import * as express from 'express';
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

const router = express.Router()
const videoService = new VideoDbService();
const userService = new UserDbService();
const videoReactionService = new VideoReactionDbService();


router.get('/users/self', (req, res) => {
    res.send(LOGGED_IN_USER)
});

router.get('/videos', (req, res) => {

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

router.get('/videos/:videoId', (req, res) => {
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

router.patch('/videos/:videoId', (req, res) => {
    const videoId = req.params.videoId;
    const requestItem = req.body as VideoPatchRequest;

    const videosData = videoService.getVideos();
    const foundIndex = videosData.findIndex(t => t.id === videoId);
    const videoResource = videosData[foundIndex];

    if ( !videoResource ) {
        res.status(404).send();
        return;
    }

    if ( videoResource.authorId !== LOGGED_IN_USER.id ) {
        res.status(403).send();
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

router.get('/videos/:videoId/reactions', (req, res) => {
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


router.post('/videos/:videoId/reactions', (req, res) => {

    const videoId = req.params.videoId;
    const requestItem = req.body as VideoReactionPostRequest;

    const videoResources = videoService.getVideos();
    const videoResource = videoResources.find(t => t.id === videoId);

    if ( !videoResource ) {
        res.status(404).send();
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

export const ApiRouter = router;