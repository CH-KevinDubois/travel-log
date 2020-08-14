import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TripsDataSource } from './trip-table-datasource';
import { TripService } from 'src/app/api/services/trip.service';
import { Trip } from 'src/app/models/trip';
import { tap } from 'rxjs/internal/operators/tap';
import { FiltersComponent } from 'src/app/chips/filters/filters.component';
;
@Component({
  selector: 'app-trip-table',
  templateUrl: './trip-table.component.html',
  styleUrls: ['./trip-table.component.scss']
})
export class TripTableComponent implements AfterViewInit, OnInit {
  @Input() userId: string = null;
  @Input() selectedTrip: Trip = null;
  @Input() onTripModified: EventEmitter<boolean>;
  @Output() onTripClicked = new EventEmitter<Trip>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Trip>;
  @ViewChild(FiltersComponent) filterList : FiltersComponent;
  dataSource: TripsDataSource;

  constructor(private tripService: TripService) {
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title'];

  ngOnInit() {
    this.dataSource = new TripsDataSource(this.tripService);
    this.dataSource.loadTrips(this.userId);
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filters = this.filterList.filters;

    this.paginator.page
      .pipe(
        tap(() => this.reloadTrips())
      )
      .subscribe();

    this.sort.sortChange
      .pipe(
        tap(() => this.reloadTrips())
      )
      .subscribe();

    this.filterList.onChange
      .pipe(
        tap(() => this.reloadTrips())
      )
      .subscribe();
  }

  reloadTrips(){
    this.dataSource.reloadTrips(this.userId);
  }

  selectTrip(trip: Trip){
    this.onTripClicked.emit(trip);
  }

}
