import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { DataStorageService } from '../data-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiNotificationHelper } from './uinotification.helper';
import { Agilis } from '../models/ae-system';
// import { Agilis } from '../../models/ae-system';

/**
 * Handler de conecciones al servidor.
 * 
 * Se encapsulan los metodos genericos de comunicación.
 * 
 * @version 2.0.0
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
	post<T>(controller: string, method: string, params: string): Observable<T>;
	post<T>(controller: string, method: string, params: string, withToken: boolean, silentError: boolean): Observable<T>;
	/** 
	 * Encapsula la contruccion de un metodo POST 
	 * @param urlCompose Es un compuesto de la url y el controller 
	 * @param method metodo del controller a llamar
	 * @param params parametros enviados en el body
	 * @param withToken `boolean` para agregar el token de conexion (default true)
	 * 
	 * @returns un `Observable` para la clase declarada
	 * 
	 * */
	post<T>(urlCompose: Agilis.UrlCompose, method: string, params: string): Observable<T>;
	post<T>(
		urlCompose: Agilis.UrlCompose,
		method: string,
		params: string,
		withToken: boolean,
		silentError: boolean
	): Observable<T>;
	post<T>(
		controllerOrUrl: string | Agilis.UrlCompose,
		method: string,
		params: string,
		withToken: boolean = true,
		silentError: boolean = false
	) {
		return this.http
			.post<T>(this.parseUrl(controllerOrUrl), new Agilis.WebClientParams(method, params), {
				params: {
					withToken: String(withToken)
				}
			})
			.pipe(catchError(this.handleError(silentError)));
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
	get<T>(controller: string, params: string): Observable<T>;
	get<T>(controller: string, params: string, withToken: boolean, silentError: boolean): Observable<T>;
	/**
	 * Encapsula la contruccion de un metodo GET
	 * @param urlCompose Es un compuesto de la url y el controller 
	 * @param params parametros enviados en el body 
	 * @param withToken `boolean` para agregar el token de conexion (default true)
	 * 
	 *  @returns un `Observable` para la clase declarada
	 * 
	 */
	get<T>(urlCompose: Agilis.UrlCompose, params: string): Observable<T>;
	get<T>(urlCompose: Agilis.UrlCompose, params: string, withToken: boolean, silentError: boolean): Observable<T>;
	get<T>(
		urlCompose: Agilis.UrlCompose,
		params: string,
		withToken: boolean,
		silentError: boolean,
		extraParams: string
	): Observable<T>;
	get<T>(
		controllerOrUrl: string | Agilis.UrlCompose,
		params: string,
		withToken: boolean = true,
		silentError: boolean = false
	): Observable<T> {
		return this.http
			.get<T>(this.parseUrl(controllerOrUrl) + '/' + params, {
				params: {
					withToken: String(withToken)
				}
			})
			.pipe(catchError(this.handleError(silentError)));
	}

	/**
	 * Retorna la url compuesta
	 * 
	 * @param controllerOrUrl 'string' | 'UrlCompose' con los datos de la url
	 * 
	 */
	parseUrl(controllerOrUrl: string | Agilis.UrlCompose) {
		if (typeof controllerOrUrl === 'string') {
			const basicUrl = ''; //this.dataStorage.credentials.getUrl();  NOT IMPLEMENTED
			return (basicUrl[basicUrl.length - 1] === '/' ? basicUrl : basicUrl + '/') + controllerOrUrl;
		} else {
			const basicUrl = controllerOrUrl.url;
			return (basicUrl[basicUrl.length - 1] === '/' ? basicUrl : basicUrl + '/') + controllerOrUrl.controller;
		}
	}

	/*
	 * Funcion para manejo de errores
	 */
	handleError(silentError) {
		return (err: HttpErrorResponse) => {
			if ((err.error as Agilis.Error).SpMessage != null) {
				const aerror: Agilis.Error = err.error;
				if (!silentError) this.uihelper.alertBasic('Atención', aerror.ErrorCode, aerror.SpMessage);
				return throwError(err);
			}

			if (err.status === 0) {
				// SIN RED
				if (!silentError) this.uihelper.alertBasic('Ups.. no hay internet', 'No pudimos encontrar una red disponible.');
				return throwError(err);
			}
			if (!silentError) this.uihelper.alertBasic('Error de Servidor', err.statusText, err.message);
			return throwError(err);
		};
	}
}
