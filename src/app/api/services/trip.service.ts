import { Injectable } from '@angular/core';
import { TripRequest } from 'src/app/models/trip-request';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { environment } from 'src/environments/environment';
import { tap, filter, concatMap, map, catchError, retry } from 'rxjs/operators';

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

  retrieveTrips(userId?: string, ascOrder?: string, page?: number, pageSize?: number): Observable<Trip[]>{
    let params: any = {};
    if(userId)
      params.user = userId;
    if(ascOrder === 'asc')
      params.sort = "title";
    else
      params.sort = "-title";
    if(page)
      params.page = page;
    if(pageSize)
      params.pageSize = pageSize;


    return this.http.get<Trip[]>(`${environment.apiUrl}/trips`, {
      params : params
    }).pipe(
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
