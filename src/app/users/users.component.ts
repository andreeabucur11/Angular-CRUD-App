import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import User from '../User';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	public users: User[] = [{
		id: 1,
		firstName: "Ana",
		lastName: "Popa",
		email: "ana.popa@bearingpoint.com",
		username: "ana.popa"
	},
	{
		id: 2,
		firstName: "Andreea",
		lastName: "Bucur",
		email: "andreea.bucur@bearingpoint.com",
		username: "andreea.bucur"
	}
	];


	public openEditForm: boolean = false;

	public userToEdit: User = new User();

	private idCounter: number = 3;

	public selectedUsers: User[] = [];

	public openConfirmDeleteDialog = false;

	public openForm: boolean = false;

	public columns: any[] = [];

	public userForm: FormGroup = this.formBuilder.group({
		firstName: ['', [Validators.required, Validators.minLength(4)]],
		lastName: ['', [Validators.required, Validators.minLength(4)]],
		email: ['', Validators.email],
		username: ''
	})

	constructor(
		private formBuilder: FormBuilder,
		private readonly router: Router
	) {		console.log(this.users);
	}

	selectUser(user: User) {
		console.log(this.selectedUsers);
		this.selectedUsers.push(user);
	}

	openAddForm() {
		console.log(this.selectedUsers)
		this.openForm = true;
	}

	ngOnInit(): void {
		console.log(this.users);
		this.columns = [
			{ field: 'id', header: 'Id', width: '3%' },
			{ field: 'firstName', header: 'First name', width: '16%' },
			{ field: 'lastName', header: 'Last name', width: '16%' },
			{ field: 'username', header: 'Username', width: '20%' },
			{ field: 'email', header: 'Email', width: '23%' },
			{ field: 'actions', header: 'Actions', width: '20%' },

		];
	}


	openDeleteDialog() {
		this.openConfirmDeleteDialog = true;
	}

	deleteUser(event: User) {
		console.log(event);
		this.users.splice(this.users.indexOf(event), 1);
	}

	addUser() {
		if(this.userForm.invalid){
			return;
		}
		if (this.userForm.value.firstName.trim() && this.userForm.value.lastName.trim() && this.userForm.value.email.trim()) {
			const user: User = {
				id: this.idCounter,
				firstName: this.userForm.value.firstName,
				lastName: this.userForm.value.lastName,
				email: this.userForm.value.email,
				username: this.userForm.value.email.split('@')[0]
			}
			this.users.push(user);
			this.openForm = false;
			this.idCounter++;

		}
		this.userForm.reset();
	}

	deleteNames() {
		this.openConfirmDeleteDialog = false;
		console.log(this.selectedUsers);
		for (let user of this.selectedUsers) {
			this.deleteUser(user);
		}
		this.selectedUsers = [];
	}

	openEditDialog(user: User) {
		console.log(this.selectedUsers)
		this.openEditForm = true;
		this.userToEdit = user;
	}

	editUser(firstName: string, lastName: string, email: string) {
		this.userToEdit.firstName = firstName;
		this.userToEdit.lastName = lastName;
		this.userToEdit.email = email;
		this.userToEdit.username = email.split('@')[0];
		this.openEditForm = false;
	}

	viewUser(user: User) {
		this.router.navigate(['/user', user.id])
		
	}

	findUserById(userId: number) {
		for (let user of this.users) {
			if (user.id == userId) {
				return user;
			}
		}
		return undefined;
	}

}
