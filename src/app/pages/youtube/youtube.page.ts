import { Component, OnInit } from '@angular/core';
import { YouTubeAPIService } from 'src/app/services/youtupeapi.service';
import { UiNotificationHelper } from 'src/app/services/uinotification.helper';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-youtube',
	templateUrl: './youtube.page.html',
	styleUrls: [ './youtube.page.scss' ]
})
export class YoutubePage implements OnInit {
	response$: Observable<any>;

	constructor(private youtube: YouTubeAPIService, private uihelper: UiNotificationHelper) {}

	ngOnInit() {
		// this.load();
	}

	get() {
		this.response$ = this.youtube.list();
	}
}
