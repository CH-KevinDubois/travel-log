import { Injectable } from '@angular/core';
import { TripRequest } from 'src/app/models/trip-request';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { environment } from 'src/environments/environment';
import { tap, filter, concatMap, map, catchError, retry } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Filter } from 'src/app/chips/filters/filters.component';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient) { }

  createNewTrip(tripRequest: TripRequest): Observable<Trip> {
    return this.http.post<Trip>(`${environment.apiUrl}/trips`, tripRequest).pipe(
      tap((trip) => console.log(trip))
    );
  }

  updateTrip(tripId: string, tripRequest: TripRequest): Observable<Trip>{
    return this.http.patch<Trip>(`${environment.apiUrl}/trips/${tripId}`, tripRequest).pipe(
      tap((trip) => console.log(trip))
    );
  }

  deleteTrip(tripId: string){
    return this.http.delete<Trip>(`${environment.apiUrl}/trips/${tripId}`);
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

  retrieveTrips(params: HttpParams): Observable<Trip[]>{
    
    return this.http.get<Trip[]>(`${environment.apiUrl}/trips`, {
      params : params
    }).pipe(
    retry(1),
    catchError(err => {
      console.log(err);
      return throwError(err);
      })
    );
  }

  retrieveFilteredTrips(params: HttpParams, filtres: string[]): Observable<Trip[]>{
    // Make sure it returns the user
    params = params.append('include', 'user');

    return this.http.get<Trip[]>(`${environment.apiUrl}/trips`, {
      params : params
    }).pipe(
    // Filters on username, description and title
    map( trips => trips.filter( t => {
      let found = false;
      filtres.forEach(filtre => {
        if(filtre === t.user.name)
          found = true;
      });
      filtres.forEach(filtre => {
        if(t.description.includes(filtre))
          found = true;
      });
      filtres.forEach(filtre => {
        if(t.title.includes(filtre))
          found = true;
      });
      return found;
    }) ),
    catchError(err => {
      console.log(err);
      return throwError(err);
      })
    );
  }

  retrieveTripsByHref(tripHref: String): Observable<Trip>{
    
    return this.http.get<Trip>(`${environment.url}${tripHref}`)
    .pipe(
    retry(1),
    catchError(err => {
      console.log(err);
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
