import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Trip } from '../models/trip';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from '../api/services/trip.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../security/auth.service';
import { cloneDeep, result } from 'lodash';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TripDialogComponent } from '../api/dialogs/trip-dialog/trip-dialog.component';
import { Place } from '../models/place';
import { PlaceDialogComponent } from '../api/dialogs/place-dialog/place-dialog.component';
import { PlaceRequest } from '../models/place-request';
import { PlaceService } from '../api/services/place.service';
import { GeoJsonLocation } from '../models/geo-json-location';
import { StateManagementService } from '../api/services/state-management.service';
import { TripRequest } from '../models/trip-request';

@Component({
  selector: 'app-my-trips-page',
  templateUrl: './my-trips-page.component.html',
  styleUrls: ['./my-trips-page.component.scss']
})
export class MyTripsPageComponent implements OnInit {
  
  myTrips: Trip[];
  dataSource: MatTableDataSource<Trip>;
  selectedTrip: Trip;
  isTripSelected: boolean;

  tripPlaces: Place[];
  dataSoucePlaceTable: MatTableDataSource<Place>;
  placeDisplayedColumns: string [] = ['name'];
  selectedPlace: Place;
  
  displayedColumns: string[] = ['title'];
  
  constructor(
    public dialog: MatDialog,
    private tripService: TripService,
    private placeService: PlaceService,
    private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef,
    private auth: AuthService,
    private stateManagement: StateManagementService
    ) {
      this.selectedTrip = new Trip();
      this.selectedPlace = new Place();
      this.isTripSelected = false;
    }
    
    ngOnInit(): void {
      this.retrieveOwnTrips();
    }
    
    retrieveOwnTrips(){
      let myId: string;
      this.auth.getUser().subscribe({
        next: (user) => {
          myId = user.id
        },
        error: _ => console.log('Cannot retrive user trips')
      });
      this.tripService.retrievePersonalTrips(myId).subscribe({
        next: (trips) => {
          this.dataSource = new MatTableDataSource(trips);
          //this.changeDetectorRefs.detectChanges();
        },
        error: err => {
          console.log(err.status);
        }
      })
    }

    openTripDialog(): void {
      console.log(this.selectedTrip);
      const selectedTripCopy = cloneDeep(this.selectedTrip);
      const dialogConfig = new MatDialogConfig();
  
      const dialogRef = this.dialog.open(TripDialogComponent, {
        width: '500px',
        minHeight: '500px',
        data: selectedTripCopy
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Trip dialog closed');
        console.log(result);
        if(result === undefined) return;

        const tripRequest = new TripRequest(result);
        if(result.id){
          console.log('edit');
          //Todo réinjecter le bon voyage updaté
          this.tripService.updateTrip(result.id, tripRequest).subscribe({
            next: result => console.log(result),
            error: error => console.log(error)
          })
        }
        else
          console.log('new');
          //Injecter le noveau voyage
          this.tripService.createNewTrip(tripRequest).subscribe({
            next: result => console.log(result),
            error: error => console.log(error)
          })
          
        //this.selectedTrip = result;
      }, error => console.log(error));
      
    }

    deleteTrip(): void {
      if(confirm("Do you want to delete the trip?")){
        this.tripService.deleteTrip(this.selectedTrip.id).subscribe({
          next: result => console.log(result),
          error: error => console.log(error)
        });
        // Delete the corresponding entry in the data source
        const index = this.dataSource.data.indexOf(this.selectedTrip);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }
    }

    openPlaceDialog(): void {
      console.log('Place dialog opened');
      const selectedPlaceCopy = cloneDeep(this.selectedPlace);
      const dialogConfig = new MatDialogConfig();
  
      const dialogRef = this.dialog.open(PlaceDialogComponent, {
        width: '500px',
        minHeight: '500px',
        disableClose: true,
        data: selectedPlaceCopy
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The placeDialog was closed');
        console.log(result);
        
        // If undefined the form has been closed just return
        if(result === undefined) return;
        // If id exists then user is editing a place
        else if(result.id !== undefined){
          //Todo edit
        }
        // Else the user is creating a place
        else{
          result.tripHref = this.selectedTrip.href;
          result.tripId = this.selectedTrip.id;
          result.location = new GeoJsonLocation(42,42);
          let placeRequest = new PlaceRequest(result);
          this.placeService.createPlace(placeRequest).subscribe({
            next: place => console.log('Place created'),
            error: err => console.log(err)
          })
        }
        this.selectedPlace = result;
      });
      
    }
    
    selectTrip(row){
      if(this.selectedTrip.id === row.id){
        this.selectedTrip = new Trip();
        //this.tripPlaces.length = 0;
        this.isTripSelected = false;
      }
      else{
        this.isTripSelected = true;
        this.selectedTrip = row;
        this.placeService.retrieveTripPlaceById(this.selectedTrip.id).subscribe({
          next: places => this.dataSoucePlaceTable = new MatTableDataSource(places),
          error: err => console.log(err)
        });
      } 
      
    }

    selectPlace(row){
      this.selectedPlace = this.selectedPlace.name === row.name ? new Place() : row; 
    }
    
    edit(row){
      console.log(`double ${row}`);
    }
    
  }
  