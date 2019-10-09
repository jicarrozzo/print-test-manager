import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiNotificationHelper } from './uinotification.helper';
import { Agilis } from '../models/ae-system';

/**
 * Handler de conecciones al servidor.
 * 
 * Se encapsulan los metodos genericos de comunicación.
 * 
 * @version 1.0.0
 * 
 */
@Injectable({ providedIn: 'root' })
export class ConnetionHandler {
	constructor(private http: HttpClient, private uihelper: UiNotificationHelper) {}

	/** 
	 * Encapsula la contruccion de un metodo POST 
	 * @param controller es el nombre de la clase en el Rest Service
	 * @param method metodo del controller a llamar
	 * @param params parametros enviados en el body
	 * @param withToken `boolean` para agregar el token de conexion (default true)
	 * 
	 * @returns un `Observable` para la clase declarada
	 * 
	 * */
	post<T>(url: string, controller: string, method: string, params: string, withToken?: boolean) {
		withToken = withToken == null ? true : withToken;
		return this.http
			.post<T>(url + controller, new Agilis.WebClientParams(method, params), {
				params: {
					withToken: String(withToken)
				}
			})
			.pipe(catchError(this.handleError()));
	}

	/**
	 * Encapsula la contruccion de un metodo GET
	 * @param controller es el nombre de la clase en el Rest Service 
	 * @param params parametros enviados en el body 
	 * @param withToken `boolean` para agregar el token de conexion (default true)
	 * 
	 *  @returns un `Observable` para la clase declarada
	 * 
	 */
	get<T>(url: string, controller: string, params: string, withToken?: boolean): Observable<T> {
		withToken = withToken == null ? true : withToken;
		return this.http
			.get<T>(url + controller + '/' + params, {
				params: {
					withToken: String(withToken)
				}
			})
			.pipe(catchError(this.handleError()));
	}

	/*
	 * Funcion para manejo de errores
	 */
	handleError() {
		return (err: HttpErrorResponse) => {
			if ((err.error as Agilis.Error).SpMessage != null) {
				const aerror: Agilis.Error = err.error;
				this.uihelper.alertBasic('Atención', aerror.ErrorCode, aerror.SpMessage);
				return throwError(err);
			}

			if (err.status === 0) {
				// SIN RED
				this.uihelper.alertBasic('Ups.. no hay internet', 'No pudimos encontrar una red disponible.');
				return throwError(err);
			}
			this.uihelper.alertBasic('Error de Servidor', err.statusText, err.error);
			return throwError(err);
		};
	}
}
