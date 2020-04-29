import { Injectable } from '@angular/core';
import { ConnetionHandler } from './connection.handler';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { YouTubeResponse } from '../models/youtube';

const youtubeAPI = environment.YouTubeUrl;
const youtubeAPIKey = environment.YouTubeAPIKey;

@Injectable({ providedIn: 'root' })
export class YouTubeAPIService {
	constructor(private http: HttpClient, private connectionHandler: ConnetionHandler) {}

	list(channelId: string) {
		return this.http.get<YouTubeResponse>(youtubeAPI + 'search', {
			params: {
				key: youtubeAPIKey,
				part: 'snippet',
				channelId, //: 'UClZ4CLO6ZFYaSTH5982p4lQ', // <- Indica el canal a filtrar
				type: 'video',
				maxResults: '50'
			}
		});
	}

	playlistItems(playlistId: string) {
		//part=snippet&playlistId=PLQUA6WTxE9VzwcpKQW6ezVwjEFlJZ8mUW
		return this.http.get<YouTubeResponse>(youtubeAPI + 'playlistItems', {
			params: {
				key: youtubeAPIKey,
				part: 'snippet',
				playlistId, //: 'UClZ4CLO6ZFYaSTH5982p4lQ', // <- Indica el canal a filtrar
				type: 'video',
				maxResults: '50'
			}
		});
	}
}
