import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { UiNotificationHelper } from './uinotification.helper';

/**
 * Service para el inicio y setup de la app.
 * 
 * Se encarga de ejectutar lo necesario para inicializar la app (signup y login)
 * y para el control de funciones a niver root
 * 
 * @version 1.0.0
 */
@Injectable({ providedIn: 'root' })
export class StartupService {
	exitPages: string[] = [ '/home' ];

	constructor(
		private navCtrl: NavController,
		private platform: Platform,
		private uihelper: UiNotificationHelper,
		private router: Router
	) {}

	/**
	 * Inicializacion de la app
	 */
	async start() {
		// try {
		// 	const c: Credentials.Identity = await this.dataStorage.credentialsLoad();
		// 	if (c.usuario == null) this.navCtrl.navigateRoot('login');
		// 	this.navCtrl.navigateRoot('home');
		// } catch (error) {
		// 	this.navCtrl.navigateRoot('signup');
		// }
	}

	/**
	 * Funcion que setea el comportamiento del backbutton y el cierre de la app
	 */
	backButtonBehaviour() {
		this.platform.backButton.subscribe(async () => {
			//if (this.router.isActive('/fleet', true) && this.router.url === '/fleet') {
			if (this.validExitPage(this.router.url)) {
				try {
					await this.uihelper.alertYesNo('Cerrar la app?', null, null);
					navigator['app'].exitApp();
				} catch (error) {
					return;
				}
			}
		});
	}
	private validExitPage(url: string): boolean {
		if (this.exitPages.find((x) => x === url)) {
			if (this.router.isActive(url, true)) return true;
		}
		return false;
	}

	/**
	 * Logout controller
	 */
	async logout() {
		// try {
		// 	await this.uihelper.alertYesNo('Cerrar sesión', null, 'Desea cerrar su sesión?');
		// } catch (error) {
		// 	return;
		// }
		// await this.dataStorage.usuarioLogout();
		// this.navCtrl.navigateRoot('login');
	}
}
