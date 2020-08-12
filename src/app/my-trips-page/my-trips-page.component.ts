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
import { Observable } from 'rxjs';
import { ActiveSelections } from '../models/active-selections';

@Component({
  selector: 'app-my-trips-page',
  templateUrl: './my-trips-page.component.html',
  styleUrls: ['./my-trips-page.component.scss']
})
export class MyTripsPageComponent implements OnInit {
  
  selections: ActiveSelections;

  myTrips: Trip[];
  dataSource: MatTableDataSource<Trip>;

  tripPlaces: Place[];
  dataSoucePlaceTable: MatTableDataSource<Place>;

  placeDisplayedColumns: string [] = ['name'];
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
      this.selections = new ActiveSelections();
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
        },
        error: err => {
          console.log(err.status);
        }
      })
    }
    
    openTripDialog(): Observable<any> {
      let tripRequest: TripRequest;
      if(this.selections.isTripSelected()){
        tripRequest = new TripRequest(this.selections.selectedTrip);
      }
      else{
        tripRequest = new TripRequest();
      }

      const dialogConfig = new MatDialogConfig();
      
      const dialogRef = this.dialog.open(TripDialogComponent, {
        width: '500px',
        minHeight: '500px',
        data: tripRequest
      });
      
      return dialogRef.afterClosed();
    }
    
    updateSelectedTrip(): void {
      this.openTripDialog().subscribe(result => {
        // If dialog closed
        if(result === undefined) return;
        
        const tripRequest = new TripRequest(result);
        this.tripService.updateTrip(result.id, tripRequest).subscribe({
          next: trip => {
            // Update the corresponding entry in the data source
            const index = this.dataSource.data.indexOf(this.selections.selectedTrip);
            this.dataSource.data.splice(index, 1, trip);
            this.dataSource._updateChangeSubscription();
          },
          // Todo specify errors if time
          error: error => console.log(error)
        });
      }, error => console.log(error));
      
    }
    
    createNewTrip(): void {
      this.openTripDialog().subscribe(result => {
        // If dialog closed
        if(result === undefined) return;
        
        const tripRequest = new TripRequest(result);
        this.tripService.createNewTrip(tripRequest).subscribe({
          next: trip => {
            // Add the new trip into data source
            this.dataSource.data.push(trip);
            this.dataSource._updateChangeSubscription();
          },
          // Todo specify errors if time
          error: error => console.log(error)
        });
      }, 
      error => console.log(error));
    }
    
    deleteSelectedTrip(): void {
      if(confirm("Do you want to delete the trip?")){
        this.tripService.deleteTrip(this.selections.selectedTrip.id).subscribe({
          next: result => console.log(result),
          error: error => console.log(error)
        });
        // Delete the corresponding entry in the data source
        const index = this.dataSource.data.indexOf(this.selections.selectedTrip);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }
    }
    
    openPlaceDialog(): void {
      console.log('Place dialog opened');

      let placeRequest: PlaceRequest;
      if(this.selections.isPlaceSelected()){
        placeRequest = new PlaceRequest(this.selections.selectedPlace);
      }
      else{
        placeRequest = new PlaceRequest();
      }
      console.log(placeRequest);
      
      const dialogConfig = new MatDialogConfig();
      
      const dialogRef = this.dialog.open(PlaceDialogComponent, {
        width: '500px',
        maxHeight: '90vh',
        disableClose: true,
        data: placeRequest
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
          result.tripHref = this.selections.selectedTrip.href;
          result.tripId = this.selections.selectedTrip.id;
          result.location = new GeoJsonLocation(42,42);
          let placeRequest = new PlaceRequest(result);
          this.placeService.createPlace(placeRequest).subscribe({
            next: place => console.log('Place created'),
            error: err => console.log(err)
          })
        }
        this.selections.selectedPlace = result;
      });
      
    }
    
    selectTrip(row){
      if(this.selections.selectedTrip === row){
        this.selections.removeSelectedTrip();
      }
      else{
        this.selections.selectedTrip = row;

        this.placeService.retrieveTripPlaceById(this.selections.selectedTrip.id).subscribe({
          next: places => this.dataSoucePlaceTable = new MatTableDataSource(places),
          error: err => console.log(err)
        });
      } 
      
    }
    
    selectPlace(row){
      if(this.selections.selectedPlace === row){
        this.selections.removeSelectedPlace();
      }
      else{
        this.selections.selectedPlace = row;
      } 
    }
    
    edit(row){
      console.log(`double ${row}`);
    }
    
  }
  