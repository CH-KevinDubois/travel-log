import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { PlacesDataSource } from './place-table-datasource';
import { Place } from 'src/app/models/place';
import { FiltersComponent } from 'src/app/chips/filters/filters.component';
import { PlaceService } from 'src/app/api/services/place.service';
import { tap } from 'rxjs/operators';
import { Trip } from 'src/app/models/trip';
import { MapManagementService } from 'src/app/api/services/map-management.service';
import { DataManagementService } from 'src/app/api/services/data-management.service';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/security/auth.service';

@Component({
  selector: 'app-place-table',
  templateUrl: './place-table.component.html',
  styleUrls: ['./place-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlaceTableComponent implements AfterViewInit, OnInit {
  @Input() onPlaceModified: EventEmitter<boolean>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Place>;
  @ViewChild(FiltersComponent) searchList : FiltersComponent;

  dataSource: PlacesDataSource;

  selectedTrip: Trip;
  selectedPlace: Place;
  isTripSelected: boolean = false;
  isPlaceSelected: boolean = false;
  tripList: Trip[];

  subscriptionTable : Subscription[] = new Array<Subscription>();

  expandedPlace: Place | null;

  // Column displayed in the table
  displayedColumns = ['name'];

  isSeachHidden: boolean = true;
  isUserAuthenticated: boolean;

  constructor(
    private placeService: PlaceService, 
    private mapManagement: MapManagementService,
    private dataManagement: DataManagementService,
    private auth: AuthService) {
  }

  // Load the places on init
  ngOnInit() {
    this.subscriptionTable.push(this.auth.isAuthenticated().subscribe({
      next: (value) => this.isUserAuthenticated = value
    }));

    this.dataSource = new PlacesDataSource(this.placeService, this.mapManagement);

    this.subscriptionTable.push(this.dataManagement.isTripSelected$.subscribe({
      next: value => this.isTripSelected = value
    }));

    this.subscriptionTable.push(this.dataManagement.isPlaceSelected$.subscribe({
      next: value => this.isPlaceSelected = value
    }));

    this.subscriptionTable.push(this.dataManagement.selectedTrip$.subscribe({
      next: value => {
        this.selectedTrip = value;
      }
    }));

    this.subscriptionTable.push(this.dataManagement.selectedPlace$.subscribe({
      next: value => {
        this.selectedPlace = value;
      }
    }));

    this.subscriptionTable.push(this.dataManagement.tripList$.subscribe({
      next: value => {
        this.tripList = value;
      }
    }));

  }

  ngAfterViewInit() {

    // Automtic reaload when a selection occurs
    this.subscriptionTable.push(this.dataManagement.selectedTrip$.pipe(
      tap( _ => {
        this.loadPlaces();
      })
      ).subscribe());

    this.subscriptionTable.push(this.dataManagement.hasPlaceChanged$.pipe(
      tap( _ => {
        this.loadPlaces();
      })
      ).subscribe());

      this.subscriptionTable.push(this.dataManagement.tripListReady$
        .subscribe({
          next: _ => {
            this.subscriptionTable.push(this.dataManagement.tripList$.pipe(
              tap( value => {
                this.tripList = value;
                this.loadPlaces();
              })
              ).subscribe());
          }
      }));

    // Set up dataSource, sort, paginator and filters
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.searches = this.searchList.filters;

    // Automatic reloads when an action occurs
      this.subscriptionTable.push(this.sort.sortChange
      .pipe(
        tap(() => this.loadPlaces())
      )
      .subscribe());

      this.subscriptionTable.push(this.searchList.onChange
      .pipe(
        tap(() => this.loadPlaces())
      )
      .subscribe());
  }

  loadPlaces(){
    if(this.isTripSelected)
      this.dataSource.loadPlaces([this.selectedTrip]);
    else
      this.dataSource.loadPlaces(this.tripList);

    this.dataManagement.removeSelectedPlace();
  }

  selectPlace(place: Place){
    if(this.isPlaceSelected && this.selectedPlace.id === place.id){
      this.dataManagement.removeSelectedPlace();
    }
    else
      this.dataManagement.emitSelectedPlace(place);
  }

  zoomClose(): void {
    if(this.isPlaceSelected){
      this.mapManagement.emitSetMapZoom(9);
    }
  }

  zoomMax(): void {
    if(this.isPlaceSelected){
      this.mapManagement.emitSetMapZoom(15);
    }
  }

  focus(): void {
    if(this.isPlaceSelected)
      this.mapManagement.emitFocusSelectedPlace(
        new GeoJsonLocation(
          this.selectedPlace.location.coordinates[0], 
          this.selectedPlace.location.coordinates[1]));
  }

  displaySearch(): void {
    if(this.isSeachHidden)
      this.isSeachHidden = false;
    else{
      const searches = this.searchList.filters;
      searches.forEach(s => this.searchList.remove(s));

      this.isSeachHidden = true;
    }
  }

  ngOnDestroy(): void{
    this.subscriptionTable.forEach(
      subscription => subscription.unsubscribe()
    );
  }

}
