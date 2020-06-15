import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "src/app/models/user";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  loadAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
}