import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of } from 'rxjs';
import { Place } from 'src/app/models/place';
import { Filter } from 'src/app/chips/filters/filters.component';
import { HttpParams } from '@angular/common/http';
import { PlaceService } from 'src/app/api/services/place.service';

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
  
  public loading$ = this.loadingSubject.asObservable();
  
  constructor(private placeService: PlaceService) {
    super();
  }
  
  loadPlaces(userId?: string, tripId?: string){
    this.loadingSubject.next(true);

    let params: HttpParams = new HttpParams();
    if(userId)
      params = params.append('user', userId);
    if(tripId)
      params = params.append('trip', tripId);
    if(this.sort){
      if(this.sort.direction === 'asc')
      params = params.append('sort', this.sort.active);
      else
      params = params.append('sort', `-${this.sort.active}`);
    }
    /* Does not work well with the API
    if(this.paginator){
      params = params.append('page', Number(this.paginator.pageIndex+1).toString());
      params = params.append('pageSize', Number(this.paginator.pageSize).toString());
    }
    */
    if(this.filters)
    this.filters.forEach(filter => params = params.append('search', filter.name));
    
    this.placeService.retrievePlaces(params).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(places => {
        this.placesSubject.next(places);
        this.data = places;
      }
        );
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