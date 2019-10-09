import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UiNotificationHelper } from './uinotification.helper';
import { environment } from '../../environments/environment';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Agilis } from '../models/ae-system';

const licenciaUrlTest = environment.licencensingUrlTest;
const licenciaUrlProd = environment.licencensingUrlProd;
/** Id del modulo asociado a la app */

const headers = new HttpHeaders({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
});

/**
 * Servicio de coneccion contra Licensing
 * 
 * @version 1.0.0
 */
@Injectable({ providedIn: 'root' })
export class AgilisLicensingService {
	constructor(private http: HttpClient, private uihelper: UiNotificationHelper) {}

	/**
	 * Obtiene los datos de una licencia
	 * @param l parametros de la licencia a buscar
	 * 
	 * @returns `Promise` con la Licencia
	 * 
	 */
	async licenseGet(Clave: string, ProductoModuloID: string, Testing: boolean = false): Promise<string> {
		const loader = await this.uihelper.createLoading('Buscando licencia');
		loader.present();

		const licenciaUrl = Testing ? licenciaUrlTest : licenciaUrlProd;

		// const resp = await this.http
		// 	.get<Agilis.Licencia[]>(licenciaUrl + `/mobile/${ProductoModuloID}/${Clave}`, {
		// 		headers
		// 	})
		// 	.pipe(finalize(() => loader.dismiss()), catchError(this.handleError()));
		const resp = await this.http
			.get<string>(licenciaUrl + `/licenciamodulo/${Clave}`, {
				headers
			})
			.pipe(finalize(() => loader.dismiss()), catchError(this.handleError()));

		return resp.toPromise();
	}

	private handleError() {
		return (err: HttpErrorResponse) => {
			switch (err.status) {
				case 0:
					{
						this.uihelper.alertBasic('Ups.. no hay internet', 'No pudimos encontrar una red disponible.');
					}
					break;
				case 404:
					{
						this.uihelper.alertBasic('Clave erronea', 'No existe una licencia con ese código.');
					}
					break;
				default:
					{
						this.uihelper.alertBasic('Error de licencia', err.message);
					}
					break;
			}
			return throwError(err);
		};
	}
}
