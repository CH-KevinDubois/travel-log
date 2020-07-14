import { Component, OnInit } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../security/auth.service';
import { ManageAccountService } from '../security/manage-account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userAuthenticated : boolean;

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
  }
  
  deleteAccount(): void {
    this.accountManager.deleteUser();
    this.auth.logout();
    this.router.navigateByUrl("/login");

  }

  ngOnInit(): void {
  }

}
