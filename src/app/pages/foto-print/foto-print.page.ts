import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-foto-print',
	templateUrl: './foto-print.page.html',
	styleUrls: [ './foto-print.page.scss' ]
})
export class FotoPrintPage implements OnInit {
	@Input() image: string;
	@Input() pos: number;

	constructor() {}

	ngOnInit() {
		console.log(this.pos);
	}
}
