import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/register-request';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ManageAccountService {

  constructor(private http: HttpClient) { 

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
}
