import { Component, OnInit, OnDestroy } from '@angular/core';
import { HelpDeskVideos } from 'src/app/models/ae-helpdeskvideos';
import { Observable, Subscription, throwError } from 'rxjs';
import { HelpDeskVideosAPIService } from 'src/app/services/helpdeskvideos.service';
import { YouTubeAPIService } from 'src/app/services/youtupeapi.service';
import { UiNotificationHelper } from 'src/app/services/uinotification.helper';
import { YouTubeResponse } from 'src/app/models/youtube';
import { Agilis } from 'src/app/models/ae-system';

@Component({
	selector: 'app-helpdeskvideos',
	templateUrl: './helpdeskvideos.page.html',
	styleUrls: [ './helpdeskvideos.page.scss' ]
})
export class HelpdeskvideosPage implements OnInit, OnDestroy {
	videoSubscription: Subscription;
	videoAddSubscription: Subscription;
	response$: Observable<HelpDeskVideos.ServiceResponse<HelpDeskVideos.Video>>;
	productoId: string = '1';
	videoId: string = '9PF6Q3rJAJo';
	showsearch: boolean = true;
	showadd: boolean = false;
	videoFound: boolean = false;
	videoToAdd: YouTubeResponse;
	videoPagename: string = '';
	videoPagePriority: string = '0';
	videoRelations: HelpDeskVideos.VideoRelacion[] = [];

	constructor(
		private helpdeskApi: HelpDeskVideosAPIService,
		private youtuveApi: YouTubeAPIService,
		private uihelper: UiNotificationHelper
	) {}
	ngOnDestroy(): void {
		if (this.videoSubscription != null) this.videoSubscription.unsubscribe();
		if (this.videoAddSubscription != null) this.videoAddSubscription.unsubscribe();
	}

	ngOnInit() {}

	search() {
		this.videoFound = false;
		this.videoToAdd = null;
		this.response$ = this.helpdeskApi.list(this.productoId, this.videoPagename != '' ? this.videoPagename : '*');
	}

	searchVideo() {
		this.videoFound = false;
		this.response$ = null;
		this.videoToAdd = null;
		this.videoPagename = '';
		this.videoPagePriority = '1';
		this.videoSubscription = this.youtuveApi.get(this.videoId).subscribe(
			(data) => {
				this.videoToAdd = data;
				this.videoRelations = [];
				this.videoFound = true;
			},
			(err) => {
				this.uihelper.toastCustom(err);
			}
		);
	}

	addPage() {
		if (this.videoPagename == '') {
			this.uihelper.toastCustom('El nombre de la pagina no puede ser vacio');
			return;
		}
		if (this.videoRelations.find((x) => x.Name === this.videoPagename) != null) {
			this.uihelper.toastCustom('Ya existe una relacion con esa pagina');
			return;
		}
		this.videoRelations.push(new HelpDeskVideos.VideoRelacion(this.videoPagename, Number(this.videoPagePriority)));
		this.videoPagename = '';
	}
	async removePage(vr: HelpDeskVideos.VideoRelacion) {
		try {
			await this.uihelper.alertYesNo('Borrar relacion', '', 'Esta seguro?');
			this.videoRelations.splice(this.videoRelations.findIndex((x) => x.Name === vr.Name), 1);
		} catch (error) {}
	}

	add() {
		const item = this.videoToAdd.items[0];
		const video = new HelpDeskVideos.Video();
		video.videoId = this.videoId;
		video.title = item.snippet.title;
		video.description = item.snippet.description;
		video.productoId = Number(this.productoId);
		video.thumbnail = item.snippet.thumbnails.default.url;
		video.relaciones = this.videoRelations;

		try {
			this.videoAddSubscription = this.helpdeskApi.crud(video, Agilis.Operaciones.ALTA).subscribe(
				async (data) => {
					if (!data.success) {
						throwError(data.message);
						return;
					}
					await this.uihelper.toastCustom('Video agregado correctamente', 5000);
					this.showsearch = true;
					this.showadd = false;
					this.search();
				},
				(err) => {
					throw err.message;
				}
			);
		} catch (error) {
			this.uihelper.toastCustom(error);
		}
	}
	async delete(video: HelpDeskVideos.Video) {
		try {
			this.videoAddSubscription = this.helpdeskApi.crud(video, Agilis.Operaciones.ALTA).subscribe(
				async (data) => {
					if (!data.success) {
						throwError(data.message);
						return;
					}
					this.search();
				},
				(err) => {
					throw err.message;
				}
			);
		} catch (error) {
			this.uihelper.toastCustom(error);
		}
	}
}
