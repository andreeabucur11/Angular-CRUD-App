import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from './user';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private _users: User[] = [{
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
	}];

	private idCounter: number = 3;

	constructor() { }

	public get users(): User[] {
		return this._users;
	}

	public set users(users: User[]) {
		this._users = users;
	}

	public addUser(user: User): void {
		user.id = this.idCounter;
		this._users.push(user);
		this.idCounter++;
	}

	public findUserById(id: number): User | undefined {
		return this.users.find(
			(user: User) => user.id === id
		);
	}

	public editUser(id: number, userForm: { firstName: string, lastName: string, email: string }): void {
		const userToEdit: User | undefined = this.findUserById(id);
		if (!userToEdit) {
			return;
		}
		if (userToEdit) {
			if(userForm.firstName) userToEdit.firstName = userForm.firstName;
			if(userForm.lastName) userToEdit.lastName = userForm.lastName;
			if(userForm.email) {
				userToEdit.email = userForm.email;
				userToEdit.username = userForm.email.split('@')[0];
			}
		}
	}

	public deleteUsers(selectedUsersIds: number[]): void {
		for (let userId of selectedUsersIds) {
			this.deleteUser(userId);
		}
	}

	public deleteUser(userId: number): void {
		const user: User | undefined = this.findUserById(userId);
		if (user) {
			this.users.splice(this.users.indexOf(user), 1);
		}
	}

}
