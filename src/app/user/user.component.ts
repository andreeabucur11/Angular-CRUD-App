import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import User from '../User';
import { UsersComponent } from '../users/users.component';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	public user: User = new User();

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router,
		
	) { 		console.log(this.user);
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.user.id = params['userId'];
			}
		)
		console.log(this.user);

	}

	redirectToUsers(){
		this.router.navigate(['']);
	}

}

