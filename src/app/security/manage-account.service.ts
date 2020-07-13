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
   * Logs in a user with the provided AuthRequest object and emits the received AuthResponse if successful.
   */
  registerUser(registerRequest: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, registerRequest).pipe(
      // The tap operator allows you to do something with an observable's emitted value
      // and emit it again unaltered.
      // In our case, we just store this AuthResponse in the localStorage
      //tap((response) => this.saveAuth(response)),
      map((response) => {
        console.log(`User ${response.name} registered`);
        //Todo : Display the good registration now
        return response;
      })
    );
  }
}
