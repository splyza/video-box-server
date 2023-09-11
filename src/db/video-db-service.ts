import * as fs from 'fs';
import { VIDEOS_DB_PATH } from '../config';
import { VideoResource } from 'src/resources/video';

export class VideoDbService {

    public getVideos() {
        const raw = fs.readFileSync(VIDEOS_DB_PATH, 'utf8');
        const data = JSON.parse(raw) as Array<VideoResource>;
        return data;
    }

    public saveVideos(videosData: Array<VideoResource>) {
        fs.writeFileSync(VIDEOS_DB_PATH, JSON.stringify(videosData), 'utf8');
    }

}