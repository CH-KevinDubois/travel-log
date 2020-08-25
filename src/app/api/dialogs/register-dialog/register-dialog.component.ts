import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from 'src/app/models/register-request';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { ManageAccountService } from 'src/app/security/manage-account.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserNotificationService } from '../../services/user-notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {
  
  registerRequest : RegisterRequest;
  
  usernameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  
  constructor(private manageAccount : ManageAccountService, 
    private userNotification: UserNotificationService,
    private router: Router) {
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
        this.manageAccount.registerUser(this.registerRequest).subscribe({
          next: (user : User) => {
            this.userNotification.openSuccessNotification(`User ${user.name} sucessfully created`)
            this.router.navigateByUrl("/");
          },
          error: (error: HttpErrorResponse) => {
            this.userNotification.openErrorNotification(error.error.message);
          }
        });
      }
    }  
  }
  