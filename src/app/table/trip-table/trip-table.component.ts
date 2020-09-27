import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TripsDataSource } from './trip-table-datasource';
import { TripService } from 'src/app/api/services/trip.service';
import { Trip } from 'src/app/models/trip';
import { tap } from 'rxjs/internal/operators/tap';
import { FiltersComponent } from 'src/app/chips/filters/filters.component';
import { DataManagementService } from 'src/app/api/services/data-management.service';
import { MapManagementService } from 'src/app/api/services/map-management.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { filter } from 'lodash';
import { AuthService } from 'src/app/security/auth.service';
import { Subscription } from 'rxjs';
;
@Component({
  selector: 'app-trip-table',
  templateUrl: './trip-table.component.html',
  styleUrls: ['./trip-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TripTableComponent implements AfterViewInit, OnInit {
  @Input() userId: string = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Trip>;
  @ViewChild('searchComponent') searchList : FiltersComponent;
  @ViewChild('filterComponent') filterList : FiltersComponent;

  dataSource: TripsDataSource;

  selectedTrip: Trip | null;
  isTripSelected: boolean;

  // Columns displayed in the table.
  displayedColumns = ['title'];
  expandedTrip: Trip | null;

  isSeachHidden: boolean = true;
  isFilterHidden: boolean = true;
  isUserAuthenticated: boolean;

  subscriptionTable : Subscription[] = new Array<Subscription>();

  constructor(
    private tripService: TripService,
    private dataManagement: DataManagementService,
    private auth: AuthService) {
  }

  ngOnInit() {
    this.subscriptionTable.push(
      this.auth.isAuthenticated().subscribe({
        next: (value) => this.isUserAuthenticated = value
    }));

    this.dataSource = new TripsDataSource(
      this.tripService,
      this.dataManagement);
    this.dataSource.loadTrips(this.userId);

    this.subscriptionTable.push(
      this.dataManagement.selectedTrip$.subscribe({
        next: trip => {
          this.selectedTrip = trip;
        }
    }));

    this.subscriptionTable.push(
      this.dataManagement.hasTripChanged$.subscribe({
        next: trip => {
          this.loadTrips();
        }
    }));

    this.subscriptionTable.push(
      this.dataManagement.isTripSelected$.subscribe({
      
        next: value => this.isTripSelected = value
    
    }));
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if(this.dataSource)
  //     if(changes.selectedTrip)
  //       this.reloadTrips();
  // }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.searches = this.searchList.filters;
    this.dataSource.filters = this.filterList.filters;

    this.subscriptionTable.push(
      this.sort.sortChange
        .pipe(
          tap(() => {
            this.loadTrips();
          })
        )
        .subscribe());

    this.subscriptionTable.push(
      this.searchList.onChange
        .pipe(
          tap(() => this.loadTrips())
        )
        .subscribe());

    this.subscriptionTable.push(
      this.filterList.onChange
        .pipe(
          tap(() => this.loadTrips())
        )
        .subscribe());
  }

  loadTrips(){
    this.dataManagement.removeSelectedTrip();
    this.dataSource.loadTrips(this.userId);
  }

  selectTrip(trip: Trip){
    if(this.isTripSelected && this.selectedTrip.id === trip.id){
      this.dataManagement.removeSelectedTrip();    
    }
    else
      this.dataManagement.emitSelectedTrip(trip);
  }

  displaySearch(): void {
    if(this.isSeachHidden){
      const filters = this.filterList.filters;
      filters.forEach(f => this.filterList.remove(f));

      this.isSeachHidden = false;
      this.isFilterHidden = true;
    }
    else{
      const searches = this.searchList.filters;
      searches.forEach(s => this.searchList.remove(s));

      this.isSeachHidden = true;
    }
  }

  displayFilter(): void {
    if(this.isFilterHidden){
      const searches = this.searchList.filters;
      searches.forEach(s => this.searchList.remove(s));

      this.isSeachHidden = true;
      this.isFilterHidden = false;
    }
    else{
      const filters = this.filterList.filters;
      filters.forEach(f => this.filterList.remove(f));

      this.isFilterHidden = true;
    }
  }

  ngOnDestroy(): void{
    this.subscriptionTable.forEach(
      subscription => subscription.unsubscribe()
    );
  }

}
