import { User } from './user';

export class Video {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly createdDate: string,
        public readonly author: User,
        public readonly url: string,
        public readonly previewUrl: string
    ) {
        // ..
    }
}

export type VideoPreview = Omit<Video, 'url' | 'description'>;