import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	public users: User[] = [];

	public openEditForm: boolean = false;

	public userToEdit: User | undefined;

	public selectedUsers: User[] = [];

	public isOpenConfirmDeleteSelectedUsersDialog: boolean = false;

	public isOpenConfirmDeleteUserDialog: boolean = false;

	public isFormOpen: boolean = false;

	public columns: any[] = [];

	public formType: "Add" | "Edit" = "Add";

	public userToDelete: User | undefined;

	public userForm: FormGroup = this.formBuilder.group({
		firstName: ['', [Validators.required, Validators.minLength(3)]],
		lastName: ['', [Validators.required, Validators.minLength(3)]],
		email: ['', [Validators.required, Validators.email]]
	})

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService
	) { }

	public ngOnInit(): void {
		this.users = this.userService.users;
		this.columns = [
			{ field: 'id', header: 'Id', width: '3%' },
			{ field: 'firstName', header: 'First name', width: '16%' },
			{ field: 'lastName', header: 'Last name', width: '16%' },
			{ field: 'username', header: 'Username', width: '20%' },
			{ field: 'email', header: 'Email', width: '23%' },
			{ field: 'actions', header: 'Actions', width: '20%' },
		];
	}

	public openForm(type: "Add" | "Edit", userId?: number): void {
		this.formType = type;
		this.isFormOpen = true;
		if (type == "Edit" && userId) {
			this.userToEdit = this.userService.findUserById(userId);
			this.userForm.value.firstName = this.userToEdit?.firstName;
			this.userForm.value.lastName = this.userToEdit?.lastName;
			this.userForm.value.email = this.userToEdit?.email;
		}
		else{
			this.userForm.reset();
		}
	}

	public openDeleteSelectedUsersDialog(): void {
		this.isOpenConfirmDeleteSelectedUsersDialog = true;
	}

	public openDeleteUserDialog(user: User): void {
		this.userToDelete = user;
		this.isOpenConfirmDeleteUserDialog = true;
	}

	public addUser(): void {
		if (this.userForm.invalid) {
			return;
		}
		if (this.userService.isEmailTaken(this.userForm.value.email)) {
			return;
		}
		const user: User = this.fromFormToUser();
		this.userService.addUser(user);
	}

	public editUser(): void {

		if (this.userToEdit) {
			this.userService.editUser(this.userToEdit.id, this.userForm.value);
		}
		this.userForm.reset();
	}

	public deleteUser(): void {
		if (this.userToDelete) {
			this.userService.deleteUser(this.userToDelete.id);
			this.isOpenConfirmDeleteUserDialog = false;
		}
	}

	public deleteUsers(): void {
		this.userService.deleteUsers(this.selectedUsers.map((user: User) => user.id));
		this.selectedUsers = [];
		this.isOpenConfirmDeleteSelectedUsersDialog = false;
	}

	public fromFormToUser(): User {
		const user: User = {
			id: 0,
			firstName: this.userForm.value.firstName,
			lastName: this.userForm.value.lastName,
			email: this.userForm.value.email,
			username: this.userForm.value.email.split('@')[0]
		}
		return user;
	}

	public submitForm(): void {
		if (this.formType === 'Add') {
			this.addUser();
		}
		else {
			this.editUser();
		}
		this.isFormOpen = false;
	}
}
