
export interface VideoActivityPostRequest {
    videoId: string;
    authorId: string;
    type: 'snapshot' | 'like';
}

export interface VideoActivityLikeRequest extends VideoActivityPostRequest {}

export interface VideoActivitySnapshotRequest extends VideoActivityPostRequest {
    timeframe: number;
    dataUri: string;
}