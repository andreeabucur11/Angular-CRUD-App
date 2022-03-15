import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { EmailValidator } from '../email.validator';

@Component({
	selector: 'app-user-form',
	templateUrl: './user-form.component.html',
	styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnChanges {

	@Input()
	public formType: "Add" | "Edit" = "Add";

	@Input()
	public userToEdit: User | undefined = undefined;

	@Output()
	public submitFormEvent: EventEmitter<{ user: User, formType: "Add" | "Edit" }> = new EventEmitter<{ user: User, formType: "Add" | "Edit" }>();

	@Output()
	public closeFormEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

	public isFormOpen: boolean = true;

	public userForm: FormGroup = this.formBuilder.group({
		firstName: ["", [Validators.required, Validators.minLength(3)]],
		lastName: ["", [Validators.required, Validators.minLength(3)]],
		email: ["", Validators.compose([
			Validators.required,
			Validators.email,
			EmailValidator.validateEmail(this.userService, { duplicateEmail: true })
		])]
	})

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService
	) {
		this.userForm = this.constructForm();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['formType']) {
			this.formType = changes['formType'].currentValue;
		}
		this.userToEdit = changes['userToEdit'].currentValue;
		this.userForm = this.constructForm();

		if (this.formType == "Edit") {
			if (this.userToEdit) {
				this.populateForm(this.userToEdit);
			}
		}
	}

	ngOnInit(): void {
		if (this.formType === "Edit") {
			if (this.userToEdit) {
				this.populateForm(this.userToEdit);
			}
		}
	}

	public get firstNameFormControl(): AbstractControl | null {
		return this.userForm.get('firstName');
	}

	public get lastNameFormControl(): AbstractControl | null {
		return this.userForm.get("lastName");
	}

	public get emailFormControl(): AbstractControl | null {
		return this.userForm.get("email");
	}

	private constructForm(): FormGroup {
		return this.formBuilder.group({
			firstName: ["", [Validators.required, Validators.minLength(3)]],
			lastName: ["", [Validators.required, Validators.minLength(3)]],
			email: ["", Validators.compose([
				Validators.required,
				Validators.email,
				EmailValidator.validateEmail(this.userService, { duplicateEmail: true })
			])]
		});
	}

	private populateForm(userToEdit: User): void {
		this.firstNameFormControl?.setValue(userToEdit.firstName);
		this.lastNameFormControl?.setValue(userToEdit.lastName);
		this.emailFormControl?.setValue(userToEdit.email);
		this.emailFormControl?.setValidators([
			Validators.required,
			Validators.email,
			EmailValidator.validateEmail(this.userService, { duplicateEmail: true }, userToEdit.email)
		])
	}

	public addUser(): void {
		const user: User = this.fromFormToUser();
		this.submitFormEvent.emit({ user: user, formType: "Add" });
	}

	public editUser(): void {
		if (this.userToEdit) {
			this.submitFormEvent.emit({ user: this.userForm.value, formType: "Edit" })
		}
	}

	public submitForm(): void {
		if (this.formType === "Add") {
			this.addUser();
			return;
		}
		this.editUser();
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

	public closeForm(): void {
		this.closeFormEvent.emit(false);
	}

}
