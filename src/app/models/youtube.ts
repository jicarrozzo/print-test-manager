// Generated by https://quicktype.io

export interface YouTubeResponse {
	kind: string;
	etag: string;
	regionCode: string;
	pageInfo: PageInfo;
	items: Item[];
}

export interface Item {
	kind: ItemKind;
	etag: string;
	id: ID;
	snippet: Snippet;
}

export interface ID {
	kind: IDKind;
	videoId: string;
}

export enum IDKind {
	YoutubeVideo = 'youtube#video'
}

export enum ItemKind {
	YoutubeSearchResult = 'youtube#searchResult'
}

export interface Snippet {
	publishedAt: string;
	channelId: ChannelID;
	title: string;
	description: string;
	thumbnails: Thumbnails;
	channelTitle: ChannelTitle;
	liveBroadcastContent: LiveBroadcastContent;
}

export enum ChannelID {
	UClZ4CLO6ZFYaSTH5982P4LQ = 'UClZ4CLO6ZFYaSTH5982p4lQ'
}

export enum ChannelTitle {
	JuanIgnacioCarrozzo = 'Juan Ignacio Carrozzo'
}

export enum LiveBroadcastContent {
	None = 'none'
}

export interface Thumbnails {
	default: Default;
	medium: Default;
	high: Default;
}

export interface Default {
	url: string;
	width: number;
	height: number;
}

export interface PageInfo {
	totalResults: number;
	resultsPerPage: number;
}