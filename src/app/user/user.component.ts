import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	public user: User = new User();

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly userService: UserService,
		private readonly router: Router
	) {
		this.getUserIdFromUrl();
	}

	public ngOnInit(): void {
		this.setUser();
	}

	public getUserIdFromUrl(): void {
		this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.user.id = parseInt(params['userId']);
			}
		)
	}

	public setUser(): void {
		const user: User | undefined = this.userService.findUserById(this.user.id);
		if(!user) {
			this.router.navigate(['']);
		}
		if (user) {
			this.user = user;
		}
	}
}

