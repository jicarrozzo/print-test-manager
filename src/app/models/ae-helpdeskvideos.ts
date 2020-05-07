export namespace HelpDeskVideos {
	export interface ServiceResponse<T> {
		data: T;
		success: boolean;
		message: string;
	}

	export class VideoParams {
		public ProductoId: number;
		public PageName: string = '';
	}

	export class Video {
		public productoId: number;
		public videoId: string;
		public title: string;
		public description: string;
		public thumbnail: string;
		public relaciones: VideoRelacion[];
		constructor() {}
		toString() {
			return JSON.stringify(this);
		}
	}

	export class VideoRelacion {
		constructor(public Name: string, public Priority: number) {}
		toString() {
			return JSON.stringify(this);
		}
	}
}
