import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from './user';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private users: User[] = [{
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

	public getUsers(): User[] {
		const users = [...this.users];
		return users;
	}

	public addUser(user: User): void {
		user.id = this.idCounter;
		this.users.push(user);
		this.idCounter++;
		console.log(this.getUsers());
		
	}

	public findUserById(id: number): User | undefined {
		return this.getUsers().find(
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
			this.users.splice(this.getUsers().indexOf(user), 1);
			console.log(user);
			
		}
		console.log(this.getUsers());
		
	}

	public isEmailTaken(email: string, currentEmail?: string): boolean {
		if(email === currentEmail) {
			return false;
		}
		return this.getUsers().some((user: User) => user.email === email);
	}

}
