import * as fs from 'fs';
import { ACTIVITIES_DB_PATH } from '../config';
import { VideoReactionResource } from 'src/resources/video-reaction';

export class VideoReactionDbService {

    public getVideoReactions(): Array<VideoReactionResource> {
        const raw = fs.readFileSync(ACTIVITIES_DB_PATH, 'utf8');
        const data = JSON.parse(raw) as Array<VideoReactionResource>;
        return data;
    }

    public saveVideoReaction(activitiesData: Array<VideoReactionResource>) {
        fs.writeFileSync(ACTIVITIES_DB_PATH, JSON.stringify(activitiesData), 'utf8');
    }

}