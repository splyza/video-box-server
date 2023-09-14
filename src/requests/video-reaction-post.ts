import { VideoReactionType } from "src/models/video-reaction";

export interface VideoReactionPostRequest {
    videoId: string;
    timeframe: number;
    type: VideoReactionType;
}

export interface VideoReactionStarRequest extends VideoReactionPostRequest {}

export interface VideoReactionSnapshotRequest extends VideoReactionPostRequest {
    dataUri: string;
}