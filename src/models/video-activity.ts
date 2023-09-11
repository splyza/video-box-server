import { User } from "./user";
import { Video } from "./video";

export interface VideoActivity {
    id: string;
    video: Video;
    author: User;
}

export class VideoActivityLike implements VideoActivity {

    public readonly type = 'like';

    constructor(
        public readonly id: string,
        public readonly video: Video,
        public readonly author: User,
        public readonly postedDate: string
    ) {}
}

export class VideoActivitySnapshot implements VideoActivity {

    public readonly type = 'snapshot';

    constructor(
        public readonly id: string,
        public readonly video: Video,
        public readonly author: User,
        public readonly createdDate: string,
        public readonly timeframe: number,
        public readonly imageUrl: string
    ) {}
}
