import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InterceptorService } from './services/interceptor/interceptor.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
	declarations: [ AppComponent ],
	entryComponents: [],
	imports: [
		HttpClientModule,
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		IonicStorageModule.forRoot({
			name: 'rsw.PrinterTest'
		})
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptorService,
			multi: true
		},
		Camera,
		File,
		WebView,
		FilePath,
		BarcodeScanner
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
