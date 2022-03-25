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

	public userToEdit: User | undefined;

	public selectedUsers: User[] = [];

	public isOpenConfirmDeleteDialog: boolean = false;

	public isFormOpen: boolean = false;

	public columns: any[] = [];

	public formType: "Add" | "Edit" = "Add";

	public userToDelete: User | undefined;

	public isEmailTaken: boolean = false;

	public isLoading: boolean = true;

	public errorMessage: { status: number, statusText: string } = {
		status: 0,
		statusText: ''
	};

	constructor(
		private userService: UserService
	) {
		this.prepareUsers();
	}

	public prepareUsers() {
		this.userService.getUsers().subscribe(
			(data) => {
				this.users = data;
				this.isLoading = false;
			},
			(error) => {
				this.isLoading = false;
				this.setError(error);
			}
		)
	}

	public setError(error: any): void {
		this.errorMessage.status = error.status;
		this.errorMessage.statusText = error.statusText;
		window.setTimeout(() => {
			this.errorMessage.status = 0;
			this.errorMessage.statusText = '';
		}, 10000)
	}

	public ngOnInit(): void {
		this.columns = [
			{ field: 'id', header: 'Id', width: '3%' },
			{ field: 'firstName', header: 'First name', width: '16%' },
			{ field: 'lastName', header: 'Last name', width: '16%' },
			{ field: 'username', header: 'Username', width: '20%' },
			{ field: 'email', header: 'Email', width: '23%' },
			{ field: 'actions', header: 'Actions', width: '20%' },
		];
	}

	public async openForm(type: "Add" | "Edit", userId?: number): Promise<void> {
		this.isEmailTaken = false;
		this.formType = type;
		if (type == "Edit" && userId) {
			this.userToEdit = await this.userService.findUserById(userId);
		}
		else {
			this.userToEdit = undefined;
		}
		this.isFormOpen = true;
	}

	public openDeleteDialog(user?: User): void {
		if(user) {
			this.userToDelete = user;
		}
		else {
			this.userToDelete = undefined;
		}
		this.isOpenConfirmDeleteDialog = true;
	}

	public delete(): void {
		if(this.userToDelete) {
			this.deleteUser();
		}
		else {
			this.deleteUsers();
		}
		this.isOpenConfirmDeleteDialog = false;
	}

	public async deleteUser(): Promise<void> {
		if (this.userToDelete) {
			const user: User | undefined = await this.userService.findUserById(this.userToDelete!.id);
			this.selectedUsers = [];
			this.isLoading = true;
			this.userService.deleteUser(this.userToDelete.id)
				.subscribe(
					() => {
						if (user) {
							this.users.splice(this.users.indexOf(user), 1);
						}
						this.isLoading = false;
					},
					(error) => {
						this.isLoading = false;
						this.setError(error);
					}
				);
		}
	}

	public deleteUsers(): void {
		this.isLoading = true;
		for (let user of this.selectedUsers) {
			this.userService.deleteUser(user.id)
				.subscribe(
					() => {
						this.users.splice(this.users.indexOf(user), 1);
						this.isLoading = false;
					},
					(error) => {
						this.isLoading = false;
						this.setError(error);
					}
				)
		}
		this.selectedUsers = [];
	}

	public closeForm(): void {
		this.isFormOpen = false;
	}

	public  addUser(user: User): void {
		this.isLoading = true;
		this.userService.addUser(user)
			.subscribe(
				() => {
					this.prepareUsers();
				},
				(error) => {
					this.setError(error);
				}
			)
	}

	public editUser(userToEdit: User): void {
		if (this.userToEdit) {
			this.isLoading = true;
			this.userService.editUser(this.userToEdit.id, userToEdit)
				.subscribe(
					() => {
						this.prepareUsers();
						this.isLoading = false;
					},
					(error) => {
						this.isLoading = false;
						this.setError(error);
					}
				);
		}
	}

	public async submitForm(event: any): Promise<void> {
		const isEmailTaken: boolean = await this.userService.isEmailTaken(event.user.email, this.userToEdit?.email);
		if (isEmailTaken) {
			this.isEmailTaken = true;
			return;
		}
		this.isFormOpen = false;
		if (event.formType === "Add") {
			this.addUser(event.user);
			return;
		}
		this.editUser(event.user);
	}

	public updateIsEmailTaken(event: boolean) {
		this.isEmailTaken = event;
	}
}


