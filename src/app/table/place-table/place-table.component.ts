import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { PlacesDataSource } from './place-table-datasource';
import { Place } from 'src/app/models/place';
import { FiltersComponent } from 'src/app/chips/filters/filters.component';
import { PlaceService } from 'src/app/api/services/place.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-place-table',
  templateUrl: './place-table.component.html',
  styleUrls: ['./place-table.component.scss']
})
export class PlaceTableComponent implements AfterViewInit, OnInit {
  @Input() userId: string = null;
  @Input() selectedPlace: Place = null;
  @Input() onPlaceModified: EventEmitter<boolean>;
  @Output() onPlaceClicked = new EventEmitter<Place>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Place>;
  @ViewChild(FiltersComponent) filterList : FiltersComponent;
  dataSource: PlacesDataSource;

  constructor(private placeService: PlaceService) {
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title'];

  ngOnInit() {
    this.dataSource = new PlacesDataSource(this.placeService);
    this.dataSource.loadPlaces(this.userId);
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
    this.dataSource.loadPlaces(this.userId);
  }

  selectPlace(place: Place){
    this.onPlaceClicked.emit(place);
  }

}
