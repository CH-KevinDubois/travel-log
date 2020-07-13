import { Component } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-logout-button",
    template: `
    <button mat-button color="warn" class="mat-focus-indicator mat-raised-button button-menu" (click)="logout()">
            <span class="mat-button-wrapper">
                <span>LoGout</span>
            </span>
            <div matripple="" class="mat-ripple mat-button-ripple"></div>
            <div class="mat-button-focus-overlay"></div>
        </button>
    `,
    styles : ['.button-menu {font-size: 1em;padding: 2px 10px;} '],

    //<button (click)="logout()">Logout</button>
})
export class LogoutButtonComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }
}
