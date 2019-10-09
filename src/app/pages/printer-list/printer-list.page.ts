import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PrinterServer } from 'src/app/models/ae-printer';
import { ModalController } from '@ionic/angular';
import { AgilisPrinterBLTService } from 'src/app/services/printer-blt.service';

@Component({
	selector: 'app-printer-list',
	templateUrl: './printer-list.page.html',
	styleUrls: [ './printer-list.page.scss' ]
})
export class PrinterListPage implements OnInit {
	printers$: Observable<PrinterServer.Printer[]>;

	constructor(private modalCtrl: ModalController, private printerService: AgilisPrinterBLTService) {}

	ngOnInit() {
		this.printers$ = this.printerService.listDevices();
	}

	select(p: PrinterServer.Printer) {
		this.modalCtrl.dismiss({ printer: p });
	}
	dismiss() {
		this.modalCtrl.dismiss();
	}
}
