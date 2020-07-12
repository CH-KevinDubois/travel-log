import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  username: string;
  password: string;

  usernameControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  constructor() { }

  ngOnInit(): void {
  }

  /**
  * Called when the login form is submitted.
  */
 onSubmit(form: NgForm) {
   console.log(form);
  }
  
}