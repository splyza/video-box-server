import { createImageFromDataUrl } from "./helpers";
import { User } from "./models/user";
import { VideoActivityPostRequest, VideoActivitySnapshotRequest } from "./requests/video-activity-post";
import { VideoResource } from "./resources/video";
import { VideoActivityResource, VideoActivityLikeResource, VideoActivitySnapshotResource } from "./resources/video-activity";

class ResourceFactory {

    public buildVideoActivityResource(
        requestItem: VideoActivityPostRequest,
        videoResource: VideoResource,
        author: User
    ): VideoActivityResource {
        const uuid = crypto.randomUUID() as string;
        let resourceItem: VideoActivityResource;
        if ( requestItem.type === 'like' ) {
            resourceItem = <VideoActivityLikeResource>{
                "id": uuid,
                "videoId": videoResource.id,
                "authorId": author.id,
                "type": "like",
                "postedDate": (new Date()).toISOString()
            };
        } else {
            const snapReq = requestItem as VideoActivitySnapshotRequest;
            const imageUrl = createImageFromDataUrl(snapReq.dataUri, uuid);
            resourceItem = <VideoActivitySnapshotResource>{
                "id": uuid,
                "videoId": videoResource.id,
                "authorId": author.id,
                "type": "snapshot",
                "createdDate": (new Date()).toISOString(),
                "timeframe": snapReq.timeframe,
                "imageUrl": imageUrl
            };
        }
        return resourceItem;
    }
}

export const RESOURCE_FACTORY = new ResourceFactory();