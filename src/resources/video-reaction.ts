import { VideoReactionType } from "src/models/video-reaction";

export interface VideoReactionResource {
    id: string;
    videoId: string;
    authorId: string;
    timeframe: number;
    type: VideoReactionType;
}

export interface VideoReactionStarResource extends VideoReactionResource {
    postedDate: string;
}

export interface VideoReactionSnapshotResource extends VideoReactionResource {
    createdDate: string;
    imageUrl: string;
}