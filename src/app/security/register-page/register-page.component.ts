import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { RegisterRequest } from 'src/app/models/register-request';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  registerRequest : RegisterRequest;

  usernameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  constructor() {
    this.registerRequest = new RegisterRequest();
   }

  ngOnInit(): void {
  }

  /**
  * Called when the login form is submitted.
  */
 onSubmit(form: NgForm) {
   console.log(form);
   if(form.valid){

   }
  }
  
}