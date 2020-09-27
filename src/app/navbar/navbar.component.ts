import { Component, OnInit } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../security/auth.service';
import { ManageAccountService } from '../security/manage-account.service';
import { User } from '../models/user';
import { LoginDialogComponent } from '../api/dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../api/dialogs/register-dialog/register-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userAuthenticated : boolean;
  user : User;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService, 
    private router: Router,
    private accountManager: ManageAccountService) {

    auth.isAuthenticated().subscribe({
      next: (value) => this.userAuthenticated = value,
      error: (error) => {
        this.userAuthenticated = false;
        console.log(error);
      }
    });

    this.auth.getUser().subscribe({
      next: (user) => this.user = user
    })
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '500px',
      maxHeight: '500px',
      position: {top: '80px', right: '10px'}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '500px',
      maxHeight: '500px',
      position: {top: '80px', right: '10px'}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }

  deleteAccount(): void {
    if(confirm("Do you really want to delete your account?")){
      this.accountManager.deleteUser();
      this.auth.logout();
      this.router.navigateByUrl("/all-trips");
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl("/all-trips");
  }

  ngOnInit(): void {
  }

}
