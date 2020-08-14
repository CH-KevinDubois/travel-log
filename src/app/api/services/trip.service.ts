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

  retrieveTrips(userId?: string, sort?: MatSort, filters?: Filter[], paginator?: MatPaginator): Observable<Trip[]>{
    let params: HttpParams = new HttpParams();
    if(userId)
      params = params.append('user', userId);
    if(sort){
      if(sort.direction === 'asc')
      params = params.append('sort', sort.active);
      else
      params = params.append('sort', `-${sort.active}`);
    }
    if(paginator){
      params = params.append('page', Number(paginator.pageIndex+1).toString());
      params = params.append('pageSize', Number(paginator.pageSize).toString());
    }
    if(filters)
      filters.forEach(filter => params = params.append('search', filter.name));
    
    console.log(params.toString());
    
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
