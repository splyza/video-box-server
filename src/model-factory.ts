import { LOGGED_IN_USER } from "./config";
import { UserDbService } from "./db/users-db-service";
import { User } from "./models/user";
import { Video } from "./models/video";
import { VideoReaction, VideoReactionStar, VideoReactionSnapshot, VideoReactionType } from "./models/video-reaction";
import { UserResource } from "./resources/user";
import { VideoResource } from "./resources/video";
import { VideoReactionResource, VideoReactionStarResource, VideoReactionSnapshotResource } from "./resources/video-reaction";

class ModelFactory {

    public videoReactionResourceToVideoReaction(
        activitiesData: Array<VideoReactionResource>,
        videoData: VideoResource,
        authorsData: Array<UserResource>
    ): Array<VideoReaction> {
        const video = new Video(
            videoData.id,
            videoData.title,
            videoData.description,
            videoData.createdDate,
            LOGGED_IN_USER,
            videoData.url
        );
    
        const results = new Array<VideoReaction>();
        for ( let item of activitiesData ) {
            const authorResource = authorsData.find( t => t.id == item.authorId )!;
            const author = new User(
                authorResource.id,
                authorResource.name,
                authorResource.pictureUrl
            )
            if ( item.type === VideoReactionType.star ) {
                const star = item as VideoReactionStarResource;
                results.push(new VideoReactionStar(
                    star!.id,
                    video,
                    author,
                    star!.postedDate,
                    star!.timeframe
                ));
            } else {
                const snapshot = item as VideoReactionSnapshotResource;
                results.push(new VideoReactionSnapshot(
                    snapshot.id,
                    video,
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
            resource.url
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