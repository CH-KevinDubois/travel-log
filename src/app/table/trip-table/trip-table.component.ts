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
  // @Input() selectedTrip: Trip = null;
  // @Output() onTripClicked = new EventEmitter<Trip>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Trip>;
  @ViewChild(FiltersComponent) filterList : FiltersComponent;

  dataSource: TripsDataSource;

  selectedTrip: Trip | null;
  isTripSelected: boolean;

  // Columns displayed in the table.
  displayedColumns = ['title'];
  expandedTrip: Trip | null;

  constructor(
    private tripService: TripService,
    private dataManagement: DataManagementService,
    private mapManagement: MapManagementService) {
  }

  ngOnInit() {
    this.dataSource = new TripsDataSource(
      this.tripService,
      this.dataManagement);
    this.dataSource.loadTrips(this.userId);

    this.dataManagement.selectedTrip$.subscribe({
      next: trip => {
        this.selectedTrip = trip;
      }
    });

    this.dataManagement.hasTripChanged$.subscribe({
      next: trip => {
        this.loadTrips();
      }
    });

    this.dataManagement.isTripSelected$.subscribe({
      next: value => this.isTripSelected = value
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if(this.dataSource)
  //     if(changes.selectedTrip)
  //       this.reloadTrips();
  // }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filters = this.filterList.filters;

    this.paginator.page
      .pipe(
        tap(() => this.loadTrips())
      )
      .subscribe();

    this.sort.sortChange
      .pipe(
        tap(() => {
          this.loadTrips();
        })
      )
      .subscribe();

    this.filterList.onChange
      .pipe(
        tap(() => this.loadTrips())
      )
      .subscribe();
  }

  loadTrips(){
    this.dataManagement.removeSelectedTrip();
    this.dataSource.loadTrips(this.userId);
    this.paginator.length = this.dataSource.data.length;
  }

  selectTrip(trip: Trip){
    if(this.isTripSelected && this.selectedTrip.id === trip.id){
      this.dataManagement.removeSelectedTrip();    
    }
    else
      this.dataManagement.emitSelectedTrip(trip);
  }

}
