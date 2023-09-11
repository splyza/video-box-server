import * as fs from 'fs';
import { ACTIVITIES_DB_PATH } from '../config';
import { VideoActivityResource } from 'src/resources/video-activity';

export class VideoActivityDbService {

    public getVideoActivities(): Array<VideoActivityResource> {
        const raw = fs.readFileSync(ACTIVITIES_DB_PATH, 'utf8');
        const data = JSON.parse(raw) as Array<VideoActivityResource>;
        return data;
    }

    public saveVideoAcivity(activitiesData: Array<VideoActivityResource>) {
        fs.writeFileSync(ACTIVITIES_DB_PATH, JSON.stringify(activitiesData), 'utf8');
    }

}