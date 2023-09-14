# video-box-server

Local RESP API service for testing. It returns mockup data.

# setup

### requirements

```npm: 16.16.0``` or later

### how to install

```npm install```

### how to run

```npm run start```


by default it runs on ```localhost:3000```

# Observations

- The server doesn't support login
- The API's are not authenticated. So, you don't need to handle authentication.
- The server was set up to load a predefined user session. The default user is "Tanaka Shigeru". All the API calls are running under this user's context.
- The server includes a small database which is already populated with some mockup data. The db contains all the data needed for completing the challenge.


# REST API Documentation

### Get current logged in user
```GET /users/self```

The system asumes that the user is already logged in, so it will always return the same user.

response:
```
// User
{
    "id": "xxxxx0",
    "name": "Tanaka Shigeru",
    "pictureUrl": "images/tanaka-icon.png"
}
```

### Get the list of videos
```GET /videos```

response json:
```
[{
  id: string,
  title: string,
  createdDate: string, // iso date string
  author: User
}]
```

### Get the details of a particular video
```GET /videos/:videoId```

response json:
```
{
  id: string,
  title: string,
  description: string,
  createdDate: string, // iso date string
  author: User,
  url: string
}
```

### Update video properties
```PATCH /videos/:videoId```

(body) json payload:
```
{
    title?: string,
    description?: string
}
```

response:
```
{
  id: string,
  title: string,
  description: string,
  createdDate: string, // iso date string
  author: User,
  url: string
}
```

### Get video reactions
``` GET /videos/:videoId/reactions ```

response:
```
[{
    id: string,
    video: Video,
    author: User,
    type: 'star',
    postedDate: string, // iso date string
    timeframe: number // seconds
}, {
    id: string,
    video: Video,
    author: User,
    type: 'snapshot',
    createdDate: string, // iso date string
    timeframe: number, // seconds
    imageUrl: string
}]
```

### Add new video reaction to an existing video
``` POST /videos/:videoId/reactions ```

(body) json payload:
```
// for star
{
    videoId: string;
    type: 'star';
    timeframe: number; // seconds
}
```

```
// for snapshot
{
    videoId: string;
    type: 'snapshot';
    timeframe: number; // seconds
    dataUri: string; // base 64 image data // sample: "data:image/png;base64,iVBORw0K=="
}
```

response:
```
[{
    id: string,
    video: Video,
    author: User,
    type: 'star',
    postedDate: string, // iso date string
    timeframe: number, // seconds
}, {
    id: string,
    video: Video,
    author: User,
    type: 'snapshot',
    createdDate: string, // iso date string
    timeframe: number, // seconds
    imageUrl: string
}]
