import { Component, OnInit } from '@angular/core';
import { YouTubeAPIService } from 'src/app/services/youtupeapi.service';
import { UiNotificationHelper } from 'src/app/services/uinotification.helper';
import { Observable } from 'rxjs';
import { YouTubeResponse } from 'src/app/models/youtube';

@Component({
	selector: 'app-youtube',
	templateUrl: './youtube.page.html',
	styleUrls: [ './youtube.page.scss' ]
})
export class YoutubePage implements OnInit {
	response$: Observable<YouTubeResponse>;

	filter: string = 'search';

	itemId: string = ''; //UCgrZf4GSkXSC2bVVeOBqlsQ Sisorg

	constructor(private youtube: YouTubeAPIService, private uihelper: UiNotificationHelper) {}

	ngOnInit() {
		// this.load();
	}

	get() {
		if (this.filter === 'search') this.response$ = this.youtube.list(this.itemId);
		if (this.filter === 'playlistItems') this.response$ = this.youtube.playlistItems(this.itemId);
	}
}
