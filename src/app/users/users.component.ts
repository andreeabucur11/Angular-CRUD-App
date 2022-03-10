import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
		firstName: '',
		lastName: '',
		email: ''
	})

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService
	) { }

	public get firstNameFormControl(): AbstractControl | null {
		return this.userForm.get('firstName');
	}

	public get lastNameFormControl(): AbstractControl | null {
		return this.userForm.get("lastName");
	}

	public get emailFormControl(): AbstractControl | null {
		return this.userForm.get("email");
	}

	public isEmailTaken(control: FormControl) {
		let email = control.value.email;
		if (this.users.some((user: User) => user.email === email)) {
			return {
				duplicateEmailId: {
					email: email
				}
			}
		}
		return null;
	}

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
			this.userForm = this.constructFormForEdit();
			if (this.userToEdit) {
				this.populateForm(this.userToEdit);
			}
		}
		else {
			this.userForm = this.constructFormForAdd();
		}
	}

	private populateForm(userToEdit: User): void {
		this.firstNameFormControl?.setValue(userToEdit.firstName);
		this.firstNameFormControl?.setValidators([Validators.required, Validators.minLength(3)]);
		this.lastNameFormControl?.setValue(userToEdit.lastName);
		this.lastNameFormControl?.setValidators([Validators.required, Validators.minLength(3)]);
		this.emailFormControl?.setValue(userToEdit.email);
		this.emailFormControl?.setValidators([Validators.required, Validators.email]);

	}
	private constructFormForEdit(): FormGroup {
		return this.formBuilder.group({
			firstName: new FormControl(),
			lastName: new FormControl(),
			email: new FormControl()
		});
	}

	private constructFormForAdd(): FormGroup {
		return this.formBuilder.group({
			firstName: ["", [Validators.required, Validators.minLength(3)]],
			lastName: ["", [Validators.required, Validators.minLength(3)]],
			email: ["", [Validators.required, Validators.email]],
		});
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
		const user: User = this.fromFormToUser();
		this.userService.addUser(user);
	}

	public editUser(): void {
		if (this.userToEdit) {
			this.userService.editUser(this.userToEdit.id, this.userForm.value);
		}
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
