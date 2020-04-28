import { Injectable } from '@angular/core';
import { ConnetionHandler } from './connection.handler';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

const youtubeAPI = environment.YouTubeUrl;
const youtubeAPIKey = environment.YouTubeAPIKey;

@Injectable({ providedIn: 'root' })
export class YouTubeAPIService {
	constructor(private http: HttpClient, private connectionHandler: ConnetionHandler) {}

	list<T>() {
		// return this.connectionHandler.get({url:youtubeAPI, controller:'search'}, 'key=').pipe(

		// );

		return this.http.get<T>(youtubeAPI + 'search', {
			params: {
				key: youtubeAPIKey,
				part: 'snippet',
				channelId: 'UClZ4CLO6ZFYaSTH5982p4lQ',
				type: 'video',
				maxResults: '50'
			}
		});
	}
}
