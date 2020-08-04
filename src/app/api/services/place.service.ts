import { Injectable } from '@angular/core';
import { PlaceRequest } from 'src/app/models/place-request';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Place } from 'src/app/models/place';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private http: HttpClient) { }

  createPlace(placeRequest: PlaceRequest): Observable<Place> {
    return this.http.post<Place>(`${environment.apiUrl}/places`, placeRequest).pipe(
      tap((place) => console.log(place))
    );
  }


  retrieveTripPlaceById(tripId: string): Observable<Place[]>{
    return this.http.get<Place[]>(`${environment.apiUrl}/places`, {params: {trip: tripId}});
  }
}
