import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FotoPage } from './foto.page';
import { FotoPrintPageModule } from '../foto-print/foto-print.module';
import { FotoPrintPage } from '../foto-print/foto-print.page';
import { PrinterListPageModule } from '../printer-list/printer-list.module';
import { PrinterListPage } from '../printer-list/printer-list.page';

const routes: Routes = [
	{
		path: '',
		component: FotoPage
	}
];

@NgModule({
	entryComponents: [ FotoPrintPage, PrinterListPage ],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		FotoPrintPageModule,
		PrinterListPageModule,
		RouterModule.forChild(routes)
	],
	declarations: [ FotoPage ]
})
export class FotoPageModule {}
