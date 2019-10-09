import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Agilis } from '../../models/ae-system';

const writelog = environment.ShowInterceptionLog;
const TestToken = environment.Token;

/**
 * Header para los msgs Http
 */
const headers = new HttpHeaders({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
});

/**
 * Urls o parte de Urls que se desea NO interceptar
 */
const overlookURLS = [ 'credential', 'licws.sisorg.com.ar', 'lic.sisorgcloud.com' ];

/**
 * 
 * Http interceptor que captura todas las llamas `http`.
 *  
 * 	Agrega los headers y el token si se solicita.
 * 	Realiza la renovacion de Token si se venció 
 * 	Dispone de una white list de url para saltear el proceso de intercepcion.
 * 
 * 	@version 1.0.0
 */
@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {
	constructor(private http: HttpClient) {}

	// Intercepts all HTTP requests!
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.log('Intercept => start');

		if (this.overlook(request.url)) {
			this.log('Intercept => excluded url ' + request.url);
			return next.handle(request);
		}

		const token = TestToken;

		// se agrega el token al header si lo necesita
		if (request.params.get('withToken')) {
			// se agregan los headers genericos
			request = request.clone({
				headers
			});
			// si TRUE se agrega Token
			if (Boolean(request.params.get('withToken'))) {
				request = request.clone({
					setHeaders: {
						Authorization: 'Bearer ' + token
					}
				});
			}
		}
		this.log('Intercept => addToken', request);

		return next.handle(request).pipe(
			catchError((err) => {
				this.log('Intercept => CatchError ', err.status);

				//if (err.status === 406) return this.refreshToken(request, next);
				//else
				return throwError(err);
			})
		);
	}

	/**
	 * Metodo que verifica la url y retorno un bool que indica si se debe interceptar o no
	 * @param request 
	 */
	overlook(url: string): boolean {
		const resp = overlookURLS.map((x: string) => url.indexOf(x) !== -1);
		return resp.find((x) => x === true) || false;
	}

	/**
	 * Metodo de regresco del token.
	 * Crea un nuevo stream post para validar las credenciales, guarda el nuevo
	 * token y vuelve a ejecutar  el stream original con las nuevas credenciales
	 * 
	 * @param request 
	 * @param next 
	 */
	// refreshToken(request: HttpRequest<any>, next: HttpHandler) {
	// 	const p = new Agilis.WebClientParams(
	// 		'Validate',
	// 		new Credentials.CredencialParams(
	// 			this.dataService.credentials.licenseKey,
	// 			this.dataService.credentials.usuario.loginName,
	// 			this.dataService.credentials.usuario.password,
	// 			this.dataService.credentials.deviceIdentifier,
	// 			null
	// 		).toString()
	// 	);
	// 	this.log('Intercept =>  RefreshToken');

	// 	// Se lanza el post para obtener las nuevas credenciales
	// 	return this.http.post(this.dataService.credentials.getUrl() + 'credential', p, { headers }).pipe(
	// 		flatMap((data: Credentials.Credential) => {
	// 			this.log('Intercept => New Token  ', data);
	// 			this.dataService.credentialsUpdate(data);

	// 			// Se modifica el token de la llamada original
	// 			if (request.params.get('withToken')) {
	// 				request = request.clone({
	// 					setHeaders: {
	// 						Authorization: 'Bearer ' + data.Token
	// 					}
	// 				});
	// 			}
	// 			this.log('Intercept => finish');
	// 			// Se vuelve a ejecutar la llamada original
	// 			return next.handle(request);
	// 		}),
	// 		catchError((err) => {
	// 			this.log('Intercept => RefreshToken => CatchError ', err.status);
	// 			return throwError(err);
	// 		})
	// 	);
	// }

	/**
	 * Log local que verifica que si se logea o no.
	 * depende de  DataStorageService.showInterceptionLog (bool)
	 * @param msg mensaje base
	 * @param opcMsg mensajes opcionales
	 */
	log(msg: any, ...opcMsg: any[]) {
		if (writelog) console.log(msg, opcMsg);
	}
}
