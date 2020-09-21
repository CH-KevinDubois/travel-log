import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize, observeOn } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of, asyncScheduler } from 'rxjs';
import { Place } from 'src/app/models/place';
import { Filter } from 'src/app/chips/filters/filters.component';
import { HttpParams } from '@angular/common/http';
import { PlaceService } from 'src/app/api/services/place.service';
import { Trip } from 'src/app/models/trip';
import { MapManagementService } from 'src/app/api/services/map-management.service';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';

/**
* Data source for the PlaceTable view. This class should
* encapsulate all logic for fetching and manipulating the displayed data
* (including sorting, pagination, and filtering).
*/
export class PlacesDataSource extends DataSource<Place> {
  data: Place[];
  paginator: MatPaginator;
  sort: MatSort;
  filters: Filter[];
  
  private placesSubject = new BehaviorSubject<Place[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public loading$ = this.loadingSubject.asObservable().pipe(
    observeOn(asyncScheduler)
  );
  
  constructor(
    private placeService: PlaceService, 
    private mapManagement: MapManagementService) {
    super();
  }
  
  loadPlaces(tripsToLoad: Trip[]) {
    this.loadingSubject.next(true);

    let params: HttpParams = new HttpParams();
    /*if(userId)
      params = params.append('user', userId);*/

    // If multiples trips, load places for each trips
    tripsToLoad.forEach(trip => 
      params = params.append('trip', trip.id))
      
    if(this.sort){
      if(this.sort.direction === 'asc')
      params = params.append('sort', 'name');
      else
      params = params.append('sort', '-name');
    }
    else
      params = params.append('sort', 'name');
    /* Does not work well with the API
    if(this.paginator){
      params = params.append('page', Number(this.paginator.pageIndex+1).toString());
      params = params.append('pageSize', Number(this.paginator.pageSize).toString());
    }
    */
    if(this.filters)
      this.filters.forEach(filter => params = params.append('search', filter.name));
    
    if(tripsToLoad.length > 1)
      params = params.append('include', 'trip');

    this.placeService.retrievePlaces(params).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(places => {
        this.placesSubject.next(places);
        this.data = places;
        // Create the data on the map
        let coordinates = new Array;
        this.data.forEach(place => {
          coordinates.push(
            // Use the coordinates bc it is not a well formed GeoJsonLocation object 
            // (/!\ it is not instanciated, thus I cannot use the setter/getter)
            new GeoJsonLocation(
              place.location.coordinates[0], 
              place.location.coordinates[1]
            )
          );
        })
        this.mapManagement.emitCoordinates(coordinates);
      });
    }
    
    /**
    * Connect this data source to the table. The table will only update when
    * the returned stream emits new items.
    * @returns A stream of the items to be rendered.
    */
    connect(): Observable<Place[]> {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return this.placesSubject.asObservable();
    }
    
    /**
    *  Called when the table is being destroyed. Use this function, to clean up
    * any open connections or free any held resources that were set up during connect.
    */
    disconnect() {}
  }