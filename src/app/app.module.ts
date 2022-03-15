import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
	declarations: [
		AppComponent,
		UserComponent,
		UsersComponent,
		UserFormComponent
	],
	imports: [
		BrowserModule,
		ButtonModule,
		ToggleButtonModule,
		FormsModule,
		BrowserAnimationsModule,
		DialogModule,
		CheckboxModule,
		ReactiveFormsModule,
		TableModule,
		RouterModule.forRoot([
			{
				path: '',
				component: UsersComponent
			},
			{
				path: 'user/:userId',
				component: UserComponent
			}
		])
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
