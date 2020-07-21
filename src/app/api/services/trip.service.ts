import { Injectable } from '@angular/core';
import { TripRequest } from 'src/app/models/trip-request';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { environment } from 'src/environments/environment';
import { tap, filter, concatMap, map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient) { }

  createTrip(tripResquest: TripRequest): Observable<Trip> {
    return this.http.post<Trip>(`${environment.apiUrl}/trips`, tripResquest).pipe(
      tap((trip) => console.log(trip))
    );
  }


  retrievePersonalTrips(personalId: string): Observable<Trip[]>{
    return this.http.get<Trip[]>(`${environment.apiUrl}/trips`).pipe(
    map(trips => trips.filter(trip => trip.userId === personalId)),
    // One more try
    retry(1),
    // Example how to catch and rethrow an error
    catchError(err => {
      console.log('Handling error locally and rethrowing it...', err);
      return throwError(err);
      })
    );
  }

  /**
   * Example how to flat an array
   */
  // retrieveAllTrips(): Observable<Trip>{
  //   return this.http.get<Trip[]>(`${environment.apiUrl}/trips`).pipe(
  //     concatMap(trips => trips));
  // }

  retrieveAllTrips(): Observable<Trip[]>{
    return this.http.get<Trip[]>(`${environment.apiUrl}/trips`);
  }
}
