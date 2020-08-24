import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-place-table',
  templateUrl: './place-table.component.html',
  styleUrls: ['./place-table.component.scss']
})
export class PlaceTableComponent implements AfterViewInit, OnInit {
  @Input() userId: string = null;
  @Input() selectedPlace: Place = null;
  @Input() selectedTrip: Trip = null;
  @Input() onPlaceModified: EventEmitter<boolean>;
  @Output() onPlaceClicked = new EventEmitter<Place>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Place>;
  @ViewChild(FiltersComponent) filterList : FiltersComponent;
  dataSource: PlacesDataSource;

  constructor(
    private placeService: PlaceService, 
    private stateManagement: MapManagementService) {
  }

  // Columns displayed in the table
  displayedColumns = ['name'];

  // Load the places on init
  ngOnInit() {
    this.dataSource = new PlacesDataSource(this.placeService, this.stateManagement);
    this.dataSource.loadPlaces(this.selectedTrip);
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filters = this.filterList.filters;

    this.paginator.page
      .pipe(
        tap(() => this.reloadPlaces())
      )
      .subscribe();

    this.sort.sortChange
      .pipe(
        tap(() => this.reloadPlaces())
      )
      .subscribe();

    this.filterList.onChange
      .pipe(
        tap(() => this.reloadPlaces())
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.dataSource){
      if(changes.selectedTrip)
        this.reloadPlaces();
      if(changes.selectedPlace)
        this.reloadPlaces();
    }
  }


  reloadPlaces(){
    this.dataSource.loadPlaces(this.selectedTrip);
  }

  selectPlace(place: Place){
    this.onPlaceClicked.emit(place);
  }

}
