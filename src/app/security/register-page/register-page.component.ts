import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

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