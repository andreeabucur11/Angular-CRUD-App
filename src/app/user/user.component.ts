import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import{ User} from '../user';
@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	public user: User = new User({});

	constructor(
		private readonly activatedRoute: ActivatedRoute,
	) { }

	public ngOnInit(): void {
		this.getInfoFromUrl();
	}

	private getInfoFromUrl(): void{
		this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.user.id = params['userId'];
			}
		)
	}
}

