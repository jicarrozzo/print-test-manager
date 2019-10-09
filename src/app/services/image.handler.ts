import { Injectable, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Storage } from '@ionic/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { environment } from 'src/environments/environment';
import { UiNotificationHelper } from './uinotification.helper';

const STORAGE_KEY = environment.ImagePath;

export enum sourceType {
	CAMERA = 1,
	LIBRARY = 2
}

@Injectable({ providedIn: 'root' })
export class ImageHandler {
	public images = [];

	constructor(
		private camera: Camera,
		private file: File,
		private webview: WebView,
		private storage: Storage,
		private plt: Platform,
		private ref: ApplicationRef,
		//private ref: ChangeDetectorRef,
		private filePath: FilePath,
		private uihelper: UiNotificationHelper
	) {}

	async loadStoredImages() {
		try {
			const imgs = await this.storage.get(STORAGE_KEY);
			this.images = [];
			if (imgs) {
				let arr = JSON.parse(imgs);
				for (let img of arr) {
					let filePath = this.file.dataDirectory + img;
					let resPath = this.pathForImage(filePath);
					this.images.push({ name: img, path: resPath, filePath: filePath });
				}
			}
			return this.images;
		} catch (error) {
			return [];
		}
	}

	takePicture(source: number) {
		const st =
			source == sourceType.CAMERA ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY;

		var options: CameraOptions = {
			quality: 100,
			sourceType: st,
			saveToPhotoAlbum: false,
			correctOrientation: true,
			targetWidth: 500,
			targetHeight: 300
		};

		this.camera.getPicture(options).then((imagePath) => {
			if (this.plt.is('android') && st === this.camera.PictureSourceType.PHOTOLIBRARY) {
				this.filePath.resolveNativePath(imagePath).then((filePath) => {
					let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
					let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
					this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
				});
			} else {
				var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
				var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
				this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
			}
		});
	}
	createFileName() {
		var d = new Date(),
			n = d.getTime(),
			newFileName = n + '.jpg';
		return newFileName;
	}

	copyFileToLocalDir(namePath, currentName, newFileName) {
		this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(
			(success) => {
				this.updateStoredImages(newFileName);
			},
			(error) => {
				this.uihelper.toastCustom('Error while storing file.');
			}
		);
	}

	updateStoredImages(name) {
		this.storage.get(STORAGE_KEY).then((images) => {
			let arr = JSON.parse(images);
			if (!arr) {
				let newImages = [ name ];
				this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
			} else {
				arr.push(name);
				this.storage.set(STORAGE_KEY, JSON.stringify(arr));
			}

			let filePath = this.file.dataDirectory + name;
			let resPath = this.pathForImage(filePath);

			let newEntry = {
				name: name,
				path: resPath,
				filePath: filePath
			};

			this.images = [ newEntry, ...this.images ];
			this.ref.tick();
			//this.ref.detectChanges(); // trigger change detection cycle
		});
	}

	pathForImage(img) {
		if (img === null) {
			return '';
		} else {
			let converted = this.webview.convertFileSrc(img);
			return converted;
		}
	}

	deleteImage(imgEntry, position) {
		this.images.splice(position, 1);

		this.storage.get(STORAGE_KEY).then((images) => {
			let arr = JSON.parse(images);
			let filtered = arr.filter((name) => name != imgEntry.name);
			this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

			var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

			this.file.removeFile(correctPath, imgEntry.name).then((res) => {
				this.uihelper.toastCustom('File removed.');
				this.ref.tick();
			});
		});
	}
}
