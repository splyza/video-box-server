import { LOGGED_IN_USER } from "./config";
import { UserDbService } from "./db/users-db-service";
import { User } from "./models/user";
import { Video } from "./models/video";
import { VideoActivity, VideoActivityLike, VideoActivitySnapshot } from "./models/video-activity";
import { UserResource } from "./resources/user";
import { VideoResource } from "./resources/video";
import { VideoActivityResource, VideoActivityLikeResource, VideoActivitySnapshotResource } from "./resources/video-activity";

class ModelFactory {

    public videoActivityResourceToVideoActivity(
        activitiesData: Array<VideoActivityResource>,
        videoData: VideoResource,
        authorsData: Array<UserResource>
    ): Array<VideoActivity> {
        const video = new Video(
            videoData.id,
            videoData.title,
            videoData.description,
            videoData.createdDate,
            LOGGED_IN_USER,
            videoData.url
        );
    
        const results = new Array<VideoActivity>();
        for ( let item of activitiesData ) {
            const authorResource = authorsData.find( t => t.id == item.authorId )!;
            const author = new User(
                authorResource.id,
                authorResource.name,
                authorResource.pictureUrl
            )
            if ( item.type === 'like' ) {
                const like = item as VideoActivityLikeResource;
                results.push(new VideoActivityLike(
                    like!.id,
                    video,
                    author,
                    like!.postedDate
                ));
            } else {
                const snapshot = item as VideoActivitySnapshotResource;
                results.push(new VideoActivitySnapshot(
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