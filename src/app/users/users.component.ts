import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import{ User} from '../user';
import { UsersService } from '../users.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	public users: User[] = [];

	public openEditForm: boolean = false;

	public userToEdit: User | undefined = new User();

	public selectedUsers: User[] = [];

	public isOpenConfirmDeleteSelectedUsersDialog: boolean = false;

	public isOpenConfirmDeleteUserDialog: boolean = false;

	public isFormOpen: boolean = false;

	public columns: any[] = [];

	public formType: "Add" | "Edit" = "Add";

	public userToDelete: User = new User();

	public userForm: FormGroup = this.formBuilder.group({
		firstName: ['', [Validators.required, Validators.minLength(4)]],
		lastName: ['', [Validators.required, Validators.minLength(4)]],
		email: ['', Validators.email]
	})

	constructor(
		private formBuilder: FormBuilder,
		private userService: UsersService
	) {	}

	
	ngOnInit(): void {
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
	
	openForm(type: "Add" | "Edit", userId?: number){
		this.formType = type;
		this.isFormOpen = true;
		if(type == "Edit" && userId){
			this.userToEdit = this.userService.findUserById(userId);
		}
		this.userForm.reset();
	}
	
	openDeleteSelectedUsersDialog() {
		this.isOpenConfirmDeleteSelectedUsersDialog = true;
	}

	openDeleteUserDialog(user: User){
		this.userToDelete = user;
		this.isOpenConfirmDeleteUserDialog = true;
	}
	
	addUser() {
		if(this.userForm.invalid){
			return;
		}
		const user: User = this.fromFormToUser(this.userForm);
		this.userService.addUser(user);		
		this.userForm.reset();
	}
	
	editUser() {		

		if(this.userToEdit){
			this.userService.editUser(this.userToEdit.id, this.userForm.value);
		}
	}
		
	deleteUser(userId: number) {
		this.userService.deleteUser(userId);
		this.isOpenConfirmDeleteUserDialog = false;
	}
	
	deleteUsers() {
		this.userService.deleteUsers(this.selectedUsers.map((user: User) => user.id));
		this.selectedUsers = [];
		this.userToDelete = new User();
		this.isOpenConfirmDeleteSelectedUsersDialog = false;
	}

	public fromFormToUser(userForm: FormGroup): User{
		const user: User = {
			id: 0,
			firstName: this.userForm.value.firstName,
			lastName: this.userForm.value.lastName,
			email: this.userForm.value.email,
			username: this.userForm.value.email.split('@')[0]
		}
		return user;
	}

	submitForm(){
		if(this.formType === 'Add'){
			this.addUser();
		}
		else{
			this.editUser();
		}
		this.isFormOpen = false;
	}

}
