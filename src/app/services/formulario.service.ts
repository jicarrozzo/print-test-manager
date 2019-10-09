import { Injectable } from '@angular/core';
import { PrinterServer } from '../models/ae-printer';
import { ConnetionHandler } from './connection.handler';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FormularioService {
	constructor(private connectionHandler: ConnetionHandler) {}

	/**
	 * Devuelve la lista de revisiones segun parametros
	 * @param p 
	 */
	get(url: string, metodo: string) {
		return this.connectionHandler.post<PrinterServer.Form[]>(url, 'Formulario', metodo, '{}').pipe(
			map((x) => {
				x = x.map((y) => {
					if (y['type'] != null) {
						const f = new PrinterServer.Form();
						f.Nombre = y['name'];
						f.Tipo = y['type'];
						f.Version = y['version'];
						f.Form = Array(...y['form']).join(' ');
						return f;
					}
					return y;
				});
				return x;
			}),
			tap((x) => console.log(x)),
			catchError((err) => {
				console.log('AmsFormularioService => get ', err);
				return throwError(err);
			})
		);
	}
}
