import { PORT } from "./config";
import { createImageFromDataUrl } from "./helpers";
import { User } from "./models/user";
import { VideoReactionType } from "./models/video-reaction";
import { VideoReactionPostRequest, VideoReactionSnapshotRequest } from "./requests/video-reaction-post";
import { VideoResource } from "./resources/video";
import { VideoReactionResource, VideoReactionStarResource, VideoReactionSnapshotResource } from "./resources/video-reaction";
import * as crypto from "crypto";

class ResourceFactory {

    public buildVideoReactionResource(
        requestItem: VideoReactionPostRequest,
        videoResource: VideoResource,
        author: User
    ): VideoReactionResource {
        const uuid = crypto.randomUUID() as string;
        let resourceItem: VideoReactionResource;
        if ( requestItem.type === VideoReactionType.star ) {
            resourceItem = <VideoReactionStarResource>{
                "id": uuid,
                "videoId": videoResource.id,
                "authorId": author.id,
                "type": VideoReactionType.star,
                "postedDate": (new Date()).toISOString(),
                "timeframe": requestItem.timeframe
            };
        } else {
            const snapReq = requestItem as VideoReactionSnapshotRequest;
            const imageUrl = `http://localhost:${PORT}/` + createImageFromDataUrl(snapReq.dataUri, uuid);
            resourceItem = <VideoReactionSnapshotResource>{
                "id": uuid,
                "videoId": videoResource.id,
                "authorId": author.id,
                "type": VideoReactionType.snapshot,
                "createdDate": (new Date()).toISOString(),
                "timeframe": snapReq.timeframe,
                "imageUrl": imageUrl
            };
        }
        return resourceItem;
    }
}

export const RESOURCE_FACTORY = new ResourceFactory();