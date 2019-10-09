import { Component, OnInit } from '@angular/core';
import { Platform, ActionSheetController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { FotoPrintPage } from '../foto-print/foto-print.page';
import { ImageHandler, sourceType } from 'src/app/services/image.handler';
import { PrinterServer } from 'src/app/models/ae-printer';
import { PrinterListPage } from '../printer-list/printer-list.page';
import { UiNotificationHelper } from 'src/app/services/uinotification.helper';
import { AgilisPrinterBLTService } from 'src/app/services/printer-blt.service';
import { File } from '@ionic-native/File/ngx';

@Component({
	selector: 'app-foto',
	templateUrl: './foto.page.html',
	styleUrls: [ './foto.page.scss' ]
})
export class FotoPage implements OnInit {
	printer: PrinterServer.Printer;
	selectedImage: string;

	constructor(
		public imageHandler: ImageHandler,
		private printerService: AgilisPrinterBLTService,
		private plt: Platform,
		private actionSheetCtrl: ActionSheetController,
		private modalCtrl: ModalController,
		private uihelper: UiNotificationHelper,
		private file: File
	) {}

	async ngOnInit() {
		this.plt.ready().then(() => {
			this.imageHandler.loadStoredImages();
		});
	}
	expand() {}

	async selectImage() {
		const actionSheet = await this.actionSheetCtrl.create({
			header: 'Agregar una imagen',
			buttons: [
				{
					text: 'Buscar en la librería',
					handler: () => {
						this.imageHandler.takePicture(sourceType.LIBRARY);
					}
				},
				{
					text: 'Usar la Cámara',
					handler: () => {
						this.imageHandler.takePicture(sourceType.CAMERA);
					}
				},
				{
					text: 'Cancelar',
					role: 'cancel'
				}
			]
		});
		await actionSheet.present();
	}

	async more(img, pos) {
		const actionSheet = await this.actionSheetCtrl.create({
			header: 'Operaciones',
			buttons: [
				{
					text: 'Eliminar',
					handler: () => {
						this.imageHandler.deleteImage(img, pos);
					}
				},
				{
					text: 'Imprimir',
					handler: () => {
						this.printImage(img, pos);
					}
				},
				{
					text: 'Cancelar',
					role: 'cancel'
				}
			]
		});
		await actionSheet.present();
	}

	async printImage(imgEntry, position) {
		console.log(imgEntry);

		const image = new Image();
		image.crossOrigin = 'Anonymous';
		image.onload = () => {
			let canvas = document.createElement('canvas');
			canvas.height = 300; // image.naturalHeight;
			canvas.width = 300; //image.naturalWidth;
			var context = canvas.getContext('2d');
			//context.scale(300 / image.naturalHeight, 300 / image.naturalWidth);
			context.drawImage(image, 0, 0);

			var imageData = canvas.toDataURL('image/jpg').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

			this.printerService.printImage(imageData, canvas.width, canvas.height, 1);
			this.printerService.printCutLine();
		};
		image.src = imgEntry.path;
		this.selectedImage = imgEntry.path;
		// this.file.readAsDataURL

		// const modal = await this.modalCtrl.create({
		// 	component: FotoPrintPage,
		// 	componentProps: {
		// 		image: imgEntry,
		// 		pos: position
		// 	}
		// });
		// modal.present();
	}

	//#region Printer

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
	//#endregion
}
