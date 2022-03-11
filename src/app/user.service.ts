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

	public editUser(id: number, userFromForm: User): void {
		const userToEdit: User | undefined = this.findUserById(id);
		if (!userToEdit) {
			return;
		}
		userToEdit.firstName = userFromForm.firstName;
		userToEdit.lastName = userFromForm.lastName;
		userToEdit.email = userFromForm.email;
		userToEdit.username = userFromForm.email.split('@')[0];

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

	public isEmailTaken(email: string, currentEmail?: string): boolean {
		if (email == currentEmail) return false;
		return this.users.some((user: User) => user.email === email);
	}

}
