import { Injectable } from '@angular/core';
import { ConnetionHandler } from './connection.handler';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HelpDeskVideos } from '../models/ae-helpdeskvideos';
import { Agilis } from '../models/ae-system';
import { UiNotificationHelper } from './uinotification.helper';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const helpdeskAPI = environment.HelpdeskUrl;
//const youtubeAPIKey = environment.YouTubeAPIKey;

@Injectable({ providedIn: 'root' })
export class HelpDeskVideosAPIService {
	constructor(private http: HttpClient, private uihelper: UiNotificationHelper) {}

	list(productoId: string, pageName: string = '*') {
		return this.http
			.get<HelpDeskVideos.ServiceResponse<HelpDeskVideos.Video>>(helpdeskAPI + 'video', {
				params: {
					withToken: 'false',
					productoId,
					pageName
				}
			})
			.pipe(catchError(this.handleError()));
	}

	crud(video: HelpDeskVideos.Video, oper: number) {
		return this.http
			.post<HelpDeskVideos.ServiceResponse<HelpDeskVideos.Video>>(helpdeskAPI + 'video', video.toString(), {
				params: {
					withToken: 'false',
					oper: oper.toString()
				}
			})
			.pipe(catchError(this.handleError()));
	}

	// delete(video: HelpDeskVideos.Video) {
	// 	return this.http
	// 		.delete<HelpDeskVideos.ServiceResponse<HelpDeskVideos.Video>>(helpdeskAPI + 'video', video.toString())
	// 		.pipe(catchError(this.handleError()));
	// }

	/*
	 * Funcion para manejo de errores
	 */
	handleError() {
		return (err: HttpErrorResponse) => {
			if ((err.error as HelpDeskVideos.ServiceResponse<any>).message != null) {
				this.uihelper.alertBasic(
					'Atención',
					err.statusText,
					(err.error as HelpDeskVideos.ServiceResponse<any>).message
				);
				return throwError(err);
			}

			if (err.status === 0) {
				// SIN RED
				this.uihelper.alertBasic('Ups.. no hay internet', 'No pudimos encontrar una red disponible.');
				return throwError(err);
			}
			this.uihelper.alertBasic('Error de Servidor', err.statusText, err.message);
			return throwError(err);
		};
	}
}
