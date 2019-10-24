import { Component, OnInit } from '@angular/core';
import { PrinterServer } from 'src/app/models/ae-printer';
import { ModalController, MenuController } from '@ionic/angular';
import { PrinterListPage } from '../printer-list/printer-list.page';
import { AgilisPrinterBLTService } from 'src/app/services/printer-blt.service';
import { UiNotificationHelper } from 'src/app/services/uinotification.helper';
import { FormGetPage } from '../form-get/form-get.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PRINTABLE_TEXT, PRINTABLE_IMAGE } from 'src/app/models/ae-resources';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: [ 'home.page.scss' ]
})
export class HomePage implements OnInit {
	printer: PrinterServer.Printer;
	textToPrint: string = '1234567890';
	qrToPrint: any;
	formToPrint: PrinterServer.Form;
	isZebra: boolean = false;

	constructor(
		private modalCtrl: ModalController,
		private printerService: AgilisPrinterBLTService,
		private uihelper: UiNotificationHelper,
		private menuCtrl: MenuController,
		private barcode: BarcodeScanner
	) {}

	ngOnInit() {
		this.menuCtrl.enable(true);
		// this.printer = new PrinterServer.Printer();
		// this.printer.name = 'TEST';
		// this.printer.address = '12120ad.asd521as5d';
	}

	async getList() {
		const modal = await this.modalCtrl.create({
			component: PrinterListPage
		});
		modal.present();
		const { data } = await modal.onDidDismiss();
		if (data) {
			this.printer = data.printer;
			this.connect();
		}
	}

	async connect() {
		try {
			//await this.printerService.connect(this.printer);
			this.printPrepare();
			console.log('printer connected');
			this.uihelper.toastCustom('Conexión OK!');
		} catch (error) {
			this.printer = null;
			console.log(error);
			this.uihelper.alertBasic('Error de conexion', error);
		}
	}

	async disconnect() {
		try {
			await this.uihelper.alertYesNo('Desconectar', null, 'Desea desconectar la impresora?');
		} catch (error) {
			return;
		}

		try {
			await this.printerService.disconnect();
			console.log('printer disconnected');
			this.uihelper.toastCustom('Desconexión OK!');
			this.printer = null;
		} catch (error) {
			console.log(error);
		}
	}
	async printPrepare() {
		try {
			const s = await this.printerService.getStatus();
		} catch (statusError) {
			try {
				await this.printerService.connect(this.printer);
				console.log('conectada!');
			} catch (e) {
				console.log('Impresora fuera de linea');
				throw e;
			}
		}
	}

	async getFormulario() {
		const modal = await this.modalCtrl.create({
			component: FormGetPage
		});
		modal.present();
		const { data } = await modal.onDidDismiss();
		console.log(data.form);
		this.formToPrint = data.form;
	}

	//#region Printing
	test(type: string) {
		try {
			this.printPrepare();
		} catch (error) {
			this.uihelper.toastCustom('No pudimos conectar la impresora, por favor vuelva a configurarla', 3000);
		}
		switch (type) {
			case 'text':
				{
					this.testText();
				}
				break;
			case 'barcode':
				{
					this.testBarcode();
				}
				break;
			case 'qr':
				{
					this.testQRcode();
				}
				break;
			case 'image':
				{
					this.testImage();
				}
				break;
		}
	}
	async testText() {
		try {
			const toPrint: string = (this.isZebra ? PRINTABLE_TEXT.zebra : PRINTABLE_TEXT.generic).replace(
				/%%TEXT-TO-PRINT/g,
				this.textToPrint
			);

			// `${PrinterServer.Commands.HARDWARE.HW_INIT}{b}${this.textToPrint}{/b}{br}
			// {h}${this.textToPrint}{/h}{br}${this.textToPrint}{br}{center}{w}${this.textToPrint}{/w}{br}{br}`;
			if (this.isZebra) {
				await this.printerService.write(toPrint);
			} else await this.printerService.printText(toPrint);
			this.uihelper.toastCustom('Impresión OK');
		} catch (error) {
			this.uihelper.alertBasic('Error de impresión', error);
		}
	}
	async testBarcode() {
		try {
			if (isNaN(+this.textToPrint)) {
				this.uihelper.alertBasic('Solo numeros', 'El texto de prueba deben ser solo numeros para pruebas de códigos');
				return;
			}
			await this.printerService.printBarcode(this.textToPrint, 75);
			await this.printerService.printCutLine();
		} catch (error) {
			this.uihelper.alertBasic('Error de impresión', error);
		}
	}
	async testQRcode() {
		try {
			this.qrToPrint = this.textToPrint;
			setTimeout(async () => {
				let qrCanvas = document.querySelector('canvas');
				let qrCanvasUrl = qrCanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
				await this.printerService.printImage(qrCanvasUrl, qrCanvas.width, qrCanvas.height, 1);
				await this.printerService.printCutLine();
			}, 100);
		} catch (error) {
			this.uihelper.alertBasic('Error de impresión', error);
		}
	}
	async testImage() {
		if (this.isZebra) {
			await this.printerService.printImage(PRINTABLE_IMAGE.zebra, 300, 300, 1);
			await this.printerService.printCutLine();
		} else {
			const image = new Image();
			image.onload = () => {
				let canvas = document.createElement('canvas');
				canvas.height = 200;
				canvas.width = 200;
				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0);

				var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, ''); //remove mimetype
				console.log(imageData);

				this.printerService.printImage(imageData, canvas.width, canvas.height, 1);
				this.printerService.printCutLine();
			};
			image.src = 'assets/lenin.jpg';
		}
	}
	async testTicketList(withQR: boolean) {
		console.log(this.processForm());

		try {
			await this.printerService.printText(this.processForm());
			if (withQR) {
				this.qrToPrint = '123456789';
				setTimeout(async () => {
					let qrCanvas = document.querySelector('canvas');
					let qrCanvasUrl = qrCanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
					await this.printerService.printImage(qrCanvasUrl, qrCanvas.width, qrCanvas.height, 1);
					await this.printerService.printCutLine();
				}, 100);
			} else await this.printerService.printCutLine();
		} catch (error) {
			this.uihelper.alertBasic('Error de impresión', error);
		}
	}

	processForm(): string {
		const getValue = (val: any): string => {
			return val == null ? '' : val.toString();
		};

		let formToPrint = this.formToPrint.Form;
		formToPrint = formToPrint.replace(/{{HRLINE}}/g, PrinterServer.Commands.HORIZONTAL_LINE.HR2_58MM);
		formToPrint = formToPrint.replace(/%/g, '');

		return PrinterServer.Commands.HARDWARE.HW_INIT + formToPrint;
	}
	//#endregion
}
