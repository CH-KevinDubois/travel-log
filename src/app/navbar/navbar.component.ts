import { Component, OnInit } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userAuthenticated : boolean;

  constructor(private auth: AuthService, route: Router) {

    auth.isAuthenticated().subscribe({
      next: (value) => this.userAuthenticated = value,
      error: (error) => {
        this.userAuthenticated = false;
        console.log(error);
      }
    });
   }

  ngOnInit(): void {
  }

}
