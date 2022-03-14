import { Component, OnInit } from '@angular/core';
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

	
	constructor(
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
		}	
		else {
			this.userToEdit = undefined;
		}
		}
		
	public openDeleteSelectedUsersDialog(): void {
		this.isOpenConfirmDeleteSelectedUsersDialog = true;
	}

	public openDeleteUserDialog(user: User): void {
		this.userToDelete = user;
		this.isOpenConfirmDeleteUserDialog = true;
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
	
	public closeForm(): void {
		this.isFormOpen = false;
	}

	public updateUserToEdit(event: any){
		this.userToEdit = event;
	}

}
