import { Component, OnInit } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../security/auth.service';
import { ManageAccountService } from '../security/manage-account.service';
import { User } from '../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userAuthenticated : boolean;
  user : User;

  constructor(
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
  
  deleteAccount(): void {
    if(confirm("Do you really want to delete your account?")){
      this.accountManager.deleteUser();
      this.auth.logout();
      this.router.navigateByUrl("/login");
    }
  }

  ngOnInit(): void {
  }

}
