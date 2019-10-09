import { Injectable } from '@angular/core';
import { PrinterServer } from '../models/ae-printer';
import { Platform } from '@ionic/angular';
import { of, from, Observable } from 'rxjs';
declare let DatecsPrinter: any;

/**
 * Controlador para conectar con las impresoras termicas
 */
@Injectable({ providedIn: 'root' })
export class AgilisPrinterBLTService {
	private win: any;

	constructor(private platform: Platform) {
		this.win = window;
		this.platform.ready().then(() => {
			if (this.win.cordova && !this.win.DatecsPrinter) {
				console.warn(
					"DatecsPrinter plugin is missing. Have you installed the plugin? \nRun 'cordova plugin add cordova-plugin-datecs-printer'"
				);
			}
		});
	}

	//#region Connection

	/**
	 * Permite obtener la lista de impresoras disponibles
	 * 
	 * @returns lista de dispositivos bluetooth previamente Emparejados (pairing)
	 */
	public listDevices(): Observable<any> {
		return from(
			new Promise((resolve, reject) => {
				this.win.DatecsPrinter.listBluetoothDevices(
					function(success) {
						resolve(success);
					},
					function(error) {
						reject(error);
					}
				);
			})
		);
	}

	/**
	 * Abre un coneccion con la impresora indicada.
	 * @param printer  Printer a conectar
	 */
	public connect(printer: PrinterServer.Printer): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.connect(
				printer.address,
				function(success) {
					resolve(success);
				},
				function(error) {
					console.log('Connected Fail: ');
					console.log(error);
					reject(error);
				}
			);
		});
	}

	/**
	 * Cierra la coneccion con la impresora previamente conectada
	 */
	public disconnect(): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.disconnect(
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}
	//#endregion

	//#region  Printing

	/**
	 * Envia a imprimir un texto con sus tags de modificacion permitidos. (tags: ver tabla)
	 * 
	 * @param text texto a imprimir
	 * @param charset conjunto de caracteres ('UTF-8', 'ISO-8859-1', etc)(opcional)
	 */
	public printText(text, charset = 'UTF-8'): Promise<any> {
		// ISO-8859-1
		return new Promise((resolve, reject) => {
			DatecsPrinter.printText(
				text,
				charset,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * envia a imprimir una imagen (base64)
	 * @param imageBase64 base64String de la imagen sin mime (.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""))
	 * @param width de la imagen
	 * @param height de la imagen
	 * @param align 0-left, 1-center, 2-right
	 */
	public printImage(imageBase64, width, height, align): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.printImage(
				imageBase64,
				width,
				height,
				align,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Envia a imprimir un codigo de barras segun el tipo.
	 * @param data texto a imprimir
	 * @param type Tipo de codigo de barras (ver tabla)(opcional)
	 */
	public printBarcode(data, type = 73): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.printBarcode(
				type,
				data,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Envia a imprimir un QR. No funciona correctamente
	 * @param size valores => 1, 4, 6, 8, 10, 12, 14
	 * @param eccLv error control level: 1 (L 7%), 2 (M 15%), 3 (Q 25%), 4 (H 30%)
	 * @param data texto a imprimir
	 */
	public printQRCode(size, eccLv, data): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.printQRCode(
				size,
				eccLv,
				data,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Permite imprimir una pagina (NO IMPLEMENTADO AUN)
	 */
	public printPage(): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.printPage(
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Permite realizar el selfTest de la impresora
	 */
	public printSelfTest(): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.printSelfTest(
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Genera lineas los espacios necesarios para finalizar la impresion
	 */
	async printCutLine(): Promise<any> {
		return await this.printText(
			//PrinterServer.Commands.HORIZONTAL_LINE.HR4_58MM +
			//PrinterServer.Commands.PAPER.PAPER_FULL_CUT +
			PrinterServer.Commands.EOL + PrinterServer.Commands.EOL + PrinterServer.Commands.EOL
		);
	}

	/**
	 * Envia a imprimir una lista de caracteres (puede ser un string)
	 * 
	 * @param bytes to print
	 */
	public write(bytes): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.write(
				bytes,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Envia a imprimir una lista de caracteres en formato hex
	 * @param hex to print
	 */
	public writeHex(hex): Promise<any> {
		return new Promise((resolve, reject) => {
			DatecsPrinter.writeHex(
				hex,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}
	//#endregion

	//#region  Drawing
	/**
	 * Permite dibujar un rectangulo (NO SE IMPLEMENTO AUN)
	 * @param x 
	 * @param y 
	 * @param width 
	 * @param height 
	 * @param fillMode 
	 */
	public drawPageRectangle(x, y, width, height, fillMode) {
		return new Promise((resolve, reject) => {
			DatecsPrinter.drawPageRectangle(
				x,
				y,
				width,
				height,
				fillMode,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Permite dibujar un frame (NO SE IMPLEMENTO AUN)
	 * @param x 
	 * @param y 
	 * @param width 
	 * @param height 
	 * @param fillMode 
	 * @param thickness 
	 */
	public drawPageFrame(x, y, width, height, fillMode, thickness) {
		return new Promise((resolve, reject) => {
			DatecsPrinter.drawPageFrame(
				x,
				y,
				width,
				height,
				fillMode,
				thickness,
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}
	//#endregion

	//#region Status Funtions

	/**
	 * Devuelve en status de la impresora
	 */
	public getStatus() {
		return new Promise((resolve, reject) => {
			DatecsPrinter.getStatus(
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}

	/**
	 * Devuelve en temperatura de la impresora (depende de la impresora)
	 */
	public getTemperature() {
		return new Promise((resolve, reject) => {
			DatecsPrinter.getTemperature(
				function(success) {
					resolve(success);
				},
				function(error) {
					reject(error);
				}
			);
		});
	}
	//#endregion
}
