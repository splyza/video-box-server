import { LOGGED_IN_USER } from "./config";
import { UserDbService } from "./db/users-db-service";
import { User } from "./models/user";
import { Video } from "./models/video";
import { VideoReactionType, VideoReactionPreview, VideoReactionPreviewSnapshot, VideoReactionPreviewStar } from "./models/video-reaction";
import { UserResource } from "./resources/user";
import { VideoResource } from "./resources/video";
import { VideoReactionResource, VideoReactionStarResource, VideoReactionSnapshotResource } from "./resources/video-reaction";

class ModelFactory {

    public videoReactionResourceToVideoReactionPreview(
        activitiesData: Array<VideoReactionResource>,
        videoData: VideoResource,
        authorsData: Array<UserResource>
    ): Array<VideoReactionPreview> {
        const video = new Video(
            videoData.id,
            videoData.title,
            videoData.description,
            videoData.createdDate,
            LOGGED_IN_USER,
            videoData.url,
            videoData.previewUrl
        );
    
        const results = new Array<VideoReactionPreview>();
        for ( let item of activitiesData ) {
            const authorResource = authorsData.find( t => t.id == item.authorId )!;
            const author = new User(
                authorResource.id,
                authorResource.name,
                authorResource.pictureUrl
            )
            if ( item.type === VideoReactionType.star ) {
                const star = item as VideoReactionStarResource;
                results.push(new VideoReactionPreviewStar(
                    star!.id,
                    video.id,
                    author,
                    star!.postedDate,
                    star!.timeframe
                ));
            } else {
                const snapshot = item as VideoReactionSnapshotResource;
                results.push(new VideoReactionPreviewSnapshot(
                    snapshot.id,
                    video.id,
                    author,
                    snapshot.createdDate,
                    snapshot.timeframe,
                    snapshot.imageUrl
                ))
            }
        }
    
        return results;
    }
    
    public videoResourceToVideo(
        resource: VideoResource, 
        userService: UserDbService
    ): Video {
        const author = this.findAuthor(resource.authorId, userService);
        return new Video(
            resource.id,
            resource.title,
            resource.description,
            resource.createdDate,
            author,
            resource.url,
            resource.previewUrl
        )
    }

    private findAuthor(userId: string, service: UserDbService): User {
        const authorsData = service.getUsers();
        const authorResource = authorsData.find( t => t.id == userId )!;
        const author = new User(
            authorResource.id,
            authorResource.name,
            authorResource.pictureUrl
        );
        return author;
    }
}

export const MODEL_FACTORY = new ModelFactory();