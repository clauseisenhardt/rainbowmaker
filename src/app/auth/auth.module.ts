import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../shared/angular-meterial.module";
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from "./auth-routing.module";

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
