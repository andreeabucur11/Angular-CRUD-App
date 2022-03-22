import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	public baseUrl = "http://localhost:3000/user";

	constructor(private httpClient: HttpClient) { }

	public getUsers(): Observable<any> {
		return this.httpClient.get<any>(this.baseUrl);
	}

	public post<T>(
		relativePath: string,
		body: unknown,
		headers?: HttpHeaders
	): Observable<T> {
		return this.httpClient.post<T>(relativePath, body, { headers });
	}

	public async addUser(user: User): Promise<User | undefined> {
		const newUser = await this.post<User>(this.baseUrl, user)
			.toPromise()
			.then(
				(response) => {
					return response;
				}
			)
			.catch(
				(error) => {
					console.log(error);
					return undefined
				}
			);
		return newUser;
	}

	public async findUserById(id: number): Promise<User> {
		try {
			const data = await this.httpClient.get<any>(`${this.baseUrl}/${id}`).toPromise();
			return data;
		} catch (error) {
			throw new Error();
		}
	}

	public editUser(id: number, userFromForm: User): Observable<any> {
		return this.httpClient.put(`${this.baseUrl}/${id}`, userFromForm);
	}

	public deleteUser(id: number) {
		return this.httpClient.delete(`http://localhost:3000/user/${id}`);
	}

	public async isEmailTaken(email: string, currentEmail?: string): Promise<boolean> {
		const isEmailTaken = await this.post<any>(`${this.baseUrl}/is-email-taken`, { formEmail: email, currentEmail: currentEmail })
			.toPromise()
			.then(
				(response: boolean) => {
					return response;
				}
			)
			.catch(
				(error) => {
					console.log(error);
					return false
				}
			);
		return isEmailTaken;
	}

}
