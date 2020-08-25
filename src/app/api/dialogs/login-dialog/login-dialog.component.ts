import { Component, OnInit } from '@angular/core';
import { AuthRequest } from 'src/app/models/auth-request';
import { AuthService } from 'src/app/security/auth.service';
import { Router } from '@angular/router';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserNotificationService } from '../../services/user-notification.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  /**
  * This authentication request object will be updated when the user
  * edits the login form. It will then be sent to the API.
  */
  authRequest: AuthRequest;
  
  usernameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  
  
  constructor(
    private auth: AuthService, 
    private router: Router, 
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private userNotification: UserNotificationService) {
      this.authRequest = new AuthRequest();
  }
  
  ngOnInit() {
    
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  /**
  * Called when the login form is submitted.
  */
  onSubmit(form: NgForm) {
    // Only do something if the form is valid
    if (form.valid) {

      // Perform the authentication request to the API.
      this.auth.login(this.authRequest).subscribe({
        next: () => {
          this.userNotification.openSuccessNotification('Successfully logged in!')
          this.router.navigateByUrl("my-trips")
        },
        error: (err) => {
          this.userNotification.openErrorNotification('Wrong credentials! Please retry.');
          console.warn(`Authentication failed: ${err.message}`);
        },
      });
    }
  }
}
