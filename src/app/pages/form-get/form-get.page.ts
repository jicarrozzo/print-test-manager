import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgilisLicensingService } from 'src/app/services/licensing.service';
import { UiNotificationHelper } from 'src/app/services/uinotification.helper';
import { Agilis } from 'src/app/models/ae-system';
import { FormularioService } from 'src/app/services/formulario.service';
import { Observable } from 'rxjs';
import { PrinterServer } from 'src/app/models/ae-printer';

@Component({
	selector: 'app-form-get',
	templateUrl: './form-get.page.html',
	styleUrls: [ './form-get.page.scss' ]
})
export class FormGetPage implements OnInit {
	clave: string = '';
	producto: string = '';
	licencia: Agilis.Licencia;
	formularios$: Observable<PrinterServer.Form[]>;

	constructor(
		private modalCtrl: ModalController,
		private licenseService: AgilisLicensingService,
		private uihelper: UiNotificationHelper,
		private formularioService: FormularioService
	) {}

	ngOnInit() {}

	async searchLicencia() {
		this.licencia = null;
		if (this.producto === '') {
			this.uihelper.toastCustom('Debe seleccionar el producto');
			return;
		}
		if (this.clave.length === 0) {
			this.uihelper.toastCustom('Debe ingresar la clave de la licencia');
			return;
		}
		try {
			const licencias = await this.licenseService.licenseGet(this.clave, this.producto);
			this.licencia = JSON.parse(licencias);
			this.getFormularios();
		} catch (error) {
			console.log(error);
		}
	}

	getFormularios() {
		this.formularios$ = this.formularioService.get(this.licencia.URL, this.producto);
	}

	select(f: PrinterServer.Form) {
		this.modalCtrl.dismiss({ form: f });
	}
	dismiss() {
		this.modalCtrl.dismiss();
	}
}
