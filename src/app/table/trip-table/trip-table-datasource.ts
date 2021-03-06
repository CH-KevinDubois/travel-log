import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize, observeOn } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of, asyncScheduler } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { TripService } from 'src/app/api/services/trip.service';
import { Filter } from 'src/app/chips/filters/filters.component';
import { HttpParams } from '@angular/common/http';
import { DataManagementService } from 'src/app/api/services/data-management.service';
import { filter } from 'lodash';

/**
* Data source for the TripTable view. 
*/
export class TripsDataSource extends DataSource<Trip> {
  data: Trip[];
  sort: MatSort;
  filters: Filter[];
  searches: Filter[];
  
  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public loading$ = this.loadingSubject.asObservable().pipe(
    observeOn(asyncScheduler)
  );
  
  constructor(
    private tripService: TripService,
    private dataManagement: DataManagementService) {
      super();
  }
  
  loadTrips(id?: string){
    this.loadingSubject.next(true);

    let params: HttpParams = new HttpParams();
    if(id)
      params = params.append('user', id);
    if(this.sort){
      if(this.sort.direction === 'asc')
      params = params.append('sort', this.sort.active);
      else
      params = params.append('sort', `-${this.sort.active}`);
    }
    else
      params = params.append('sort', 'title');

    params = params.append('pageSize', '49');

    if(this.searches)
    this.searches.forEach(search => 
      params = params.append('search', search.name));
    
    if(this.filters && this.filters.length > 0){
      this.tripService.retrieveFilteredTrips(params, this.filters).pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
          )
          .subscribe(trips => {
            this.tripsSubject.next(trips);
            this.dataManagement.emitTripList(trips);
            this.data = trips;
          }
            );
    }
    else{
      this.tripService.retrieveTrips(params).pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
          )
          .subscribe(trips => {
            this.tripsSubject.next(trips);
            this.dataManagement.emitTripList(trips);
            this.data = trips;
          }
            );
    }
    
  }
    
    /**
    * Connect this data source to the table. The table will only update when
    * the returned stream emits new items.
    * @returns A stream of the items to be rendered.
    */
    connect(): Observable<Trip[]> {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return this.tripsSubject.asObservable();
    }

    /**
    *  Called when the table is being destroyed. Use this function, to clean up
    * any open connections or free any held resources that were set up during connect.
    */
    disconnect() { 
      this.dataManagement.emitTripList([]);
    }
    
  }
  