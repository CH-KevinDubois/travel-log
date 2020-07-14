import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/register-request';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ManageAccountService {

  user : User;

  constructor(
    private http: HttpClient,
    private auth : AuthService,
    private router : Router) { 
      this.auth.getUser().subscribe({
        next: (user : User) => this.user = user})
  }

  /**
   * Register an user with the provided RegisterRequest object and emits the received User if successful.
   */
  registerUser(registerRequest: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, registerRequest).pipe(
      tap((response) => {
        console.log(`User ${response.name} registered`);
      })
    );
  }


  /**
   * Delete an useraccount
   */
  deleteUser(): void {
    this.http.delete<any>(`${environment.apiUrl}/users/${this.user.id}`).subscribe({
      next: (value) => console.log('next value : ' + value),
      error: (value) => console.log('error value : ' + value)
    }
    );
    console.log(`User ${this.user.name} deleted`); 
  }
}
