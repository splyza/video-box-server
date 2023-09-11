
export interface VideoActivityResource {
    id: string;
    videoId: string;
    authorId: string;
    type: 'snapshot' | 'like';
}

export interface VideoActivityLikeResource extends VideoActivityResource {
    postedDate: string;
}

export interface VideoActivitySnapshotResource extends VideoActivityResource {
    createdDate: string;
    timeframe: number;
    imageUrl: string;
}