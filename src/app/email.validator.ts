import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserService } from "./user.service";

export class EmailValidator {

	static validateEmail(userService: UserService, error: ValidationErrors, currentEmail?: string): ValidatorFn {		
		return (control: AbstractControl): ValidationErrors | null => {
			const email: string = control.value;
			return userService.isEmailTaken(email, currentEmail) ? error : null;
		}
	}
}