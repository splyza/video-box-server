import { User } from "./user";
import { Video } from "./video";

export enum VideoReactionType {
    star = 'star',
    snapshot = 'snapshot'
}

export interface VideoReaction {
    id: string;
    video: Video;
    author: User;
    timeframe: number;
    type: VideoReactionType;
}

export class VideoReactionStar implements VideoReaction {

    public readonly type = VideoReactionType.star;

    constructor(
        public readonly id: string,
        public readonly video: Video,
        public readonly author: User,
        public readonly postedDate: string,
        public readonly timeframe: number
    ) {}
}

export class VideoReactionSnapshot implements VideoReaction {

    public readonly type = VideoReactionType.snapshot;

    constructor(
        public readonly id: string,
        public readonly video: Video,
        public readonly author: User,
        public readonly createdDate: string,
        public readonly timeframe: number,
        public readonly imageUrl: string
    ) {}
}

export type VideoReactionPreview = Omit<VideoReaction, 'video'> & {videoId: string};


export class VideoReactionPreviewStar implements VideoReactionPreview {

    public readonly type = VideoReactionType.star;

    constructor(
        public readonly id: string,
        public readonly videoId: string,
        public readonly author: User,
        public readonly postedDate: string,
        public readonly timeframe: number
    ) {}
}

export class VideoReactionPreviewSnapshot implements VideoReactionPreview {

    public readonly type = VideoReactionType.snapshot;

    constructor(
        public readonly id: string,
        public readonly videoId: string,
        public readonly author: User,
        public readonly createdDate: string,
        public readonly timeframe: number,
        public readonly imageUrl: string
    ) {}
}
