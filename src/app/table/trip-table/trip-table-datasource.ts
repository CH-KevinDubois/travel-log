import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { TripService } from 'src/app/api/services/trip.service';
import { Filter } from 'src/app/chips/filters/filters.component';
import { HttpParams } from '@angular/common/http';

/**
* Data source for the TripTable view. This class should
* encapsulate all logic for fetching and manipulating the displayed data
* (including sorting, pagination, and filtering).
*/
export class TripsDataSource extends DataSource<Trip> {
  data: Trip[];
  paginator: MatPaginator;
  sort: MatSort;
  filters: Filter[];
  
  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public loading$ = this.loadingSubject.asObservable();
  
  constructor(private tripService: TripService) {
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
    /* Does not work well with the API
    if(this.paginator){
      params = params.append('page', Number(this.paginator.pageIndex+1).toString());
      params = params.append('pageSize', Number(this.paginator.pageSize).toString());
    }
    */
    if(this.filters)
    this.filters.forEach(filter => params = params.append('search', filter.name));
    
    this.tripService.retrieveTrips(params).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(trips => {
        this.tripsSubject.next(trips);
        this.data = trips;
      }
        );
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
    //   const dataMutations = [
    //     this.tripsSubject.asObservable(),
    //     this.paginator.page,
    //     this.sort.sortChange
    //   ];
      
    //   return merge(...dataMutations).pipe(map(() => {
    //     return this.getPagedData(this.getSortedData([...this.data]));
    //   }));
    // }
    
    /**
    *  Called when the table is being destroyed. Use this function, to clean up
    * any open connections or free any held resources that were set up during connect.
    */
    disconnect() {}
    
    /**
    * Paginate the data (client-side). If you're using server-side pagination,
    * this would be replaced by requesting the appropriate data from the server.
    */
    private getPagedData(data: Trip[]) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    }
    
    /**
    * Sort the data (client-side). If you're using server-side sorting,
    * this would be replaced by requesting the appropriate data from the server.
    */
    private getSortedData(data: Trip[]) {
      if (!this.sort.active || this.sort.direction === '') {
        return data;
      }
      
      return data.sort((a, b) => {
        const isAsc = this.sort.direction === 'asc';
        switch (this.sort.active) {
          case 'title': return compare(a.title, b.title, isAsc);
          case 'id': return compare(+a.id, +b.id, isAsc);
          default: return 0;
        }
      });
    }
  }
  
  /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
  function compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  