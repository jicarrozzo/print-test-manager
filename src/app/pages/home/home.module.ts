import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { PrinterListPageModule } from '../printer-list/printer-list.module';
import { PrinterListPage } from '../printer-list/printer-list.page';
import { FormGetPage } from '../form-get/form-get.page';
import { FormGetPageModule } from '../form-get/form-get.module';

@NgModule({
	entryComponents: [ PrinterListPage, FormGetPage ],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		NgxQRCodeModule,
		RouterModule.forChild([
			{
				path: '',
				component: HomePage
			}
		]),
		PrinterListPageModule,
		FormGetPageModule
	],
	declarations: [ HomePage ]
})
export class HomePageModule {}
