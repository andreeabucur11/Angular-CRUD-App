import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
@Component({
	selector: 'app-user-form',
	templateUrl: './user-form.component.html',
	styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

	@Input()
	public formType: "Add" | "Edit" = "Add";

	@Input()
	public userToEdit: User | undefined = undefined;

	@Input()
	public isEmailTaken: boolean = false;

	@Output()
	public onSubmit = new EventEmitter<{ user: User, formType: "Add" | "Edit" }>();

	@Output()
	public onClose = new EventEmitter<void>();

	@Output()
	public onUpdateIsEmailTaken = new EventEmitter<boolean>();

	public isVisible: boolean = true;

	userForm = this.formBuilder.group({
		firstName: ["", [Validators.required, Validators.minLength(3)]],
		lastName: ["", [Validators.required, Validators.minLength(3)]],
		email: ["", [
			Validators.required,
			Validators.email
		]]
	});

	constructor(
		private formBuilder: FormBuilder
	) {
	}

	public ngOnInit(): void {
		this.userForm.reset();
		if (this.formType === "Edit") {
			if (this.userToEdit) {
				this.populateForm();
			}
		}
	}

	public get firstNameFormControl(): AbstractControl | null {
		return this.userForm!.get('firstName');
	}

	public get lastNameFormControl(): AbstractControl | null {
		return this.userForm!.get("lastName");
	}

	public get emailFormControl(): AbstractControl | null {
		return this.userForm!.get("email");
	}

	private populateForm(): void {
		this.firstNameFormControl?.setValue(this.userToEdit?.firstName);
		this.lastNameFormControl?.setValue(this.userToEdit?.lastName);
		this.emailFormControl?.setValue(this.userToEdit?.email);
	}

	public addUser(): void {
		const user: User = this.fromFormToUser();
		this.onSubmit.emit({ user: user, formType: "Add" });
	}

	public editUser(): void {
		if (this.userToEdit) {
			const user = this.fromFormToUser();
			this.onSubmit.emit({ user: user, formType: "Edit" })
		}
	}

	public handleSubmitForm(): void {
		if (this.formType === "Add") {
			this.addUser();
			return;
		}
		this.editUser();
	}

	public setIsEmailTakenToFalse(): void {
		this.isEmailTaken = false;
		this.onUpdateIsEmailTaken.emit(false);
	}

	public fromFormToUser(): User {
		const user: User = new User({});
		if (this.userForm?.value.firstName !== this.userToEdit?.firstName) {
			user.firstName = this.userForm?.value.firstName;
		}
		if (this.userForm?.value.lastName !== this.userToEdit?.lastName) {
			user.lastName = this.userForm?.value.lastName;
		}
		if (this.userForm?.value.email !== this.userToEdit?.email) {
			user.email = this.userForm?.value.email;
			user.username = this.userForm?.value.email.split('@')[0]
		}
		return user;
	}

	public handleHide(): void {
		this.onClose.emit();
	}

}
