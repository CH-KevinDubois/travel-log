import { Component, OnInit, ChangeDetectorRef, ViewChild, SimpleChanges } from '@angular/core';
import { Trip } from '../models/trip';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from '../api/services/trip.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../security/auth.service';
import { cloneDeep, result } from 'lodash';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TripDialogComponent } from '../api/dialogs/trip-dialog/trip-dialog.component';
import { Place } from '../models/place';
import { PlaceDialogComponent } from '../api/dialogs/place-dialog/place-dialog.component';
import { PlaceRequest } from '../models/place-request';
import { PlaceService } from '../api/services/place.service';
import { GeoJsonLocation } from '../models/geo-json-location';
import { MapManagementService } from '../api/services/map-management.service';
import { TripRequest } from '../models/trip-request';
import { Observable } from 'rxjs';
import { ActiveSelections } from '../models/active-selections';
import { Marker, marker, Icon, IconOptions, icon } from 'leaflet';
import { TripTableComponent } from '../table/trip-table/trip-table.component';
import { PlaceTableComponent } from '../table/place-table/place-table.component';
import { MapComponent } from '../map/map.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const defaultIcon: Icon<IconOptions> = icon({
  // This define the displayed icon size, in pixel
  iconSize: [ 25, 41 ],
  // This defines the pixel that should be placed right above the location
  // If not provided, the image center will be used, and that could be awkward
  iconAnchor: [ 13, 41 ],
  // The path to the image to display. In this case, it's a Leaflet asset
  iconUrl: 'leaflet/pin.svg',
  // The path to the image's shadow to display. Also a leaflet asset
  shadowUrl: 'leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-my-trips-page',
  templateUrl: './my-trips-page.component.html',
  styleUrls: ['./my-trips-page.component.scss']
})
export class MyTripsPageComponent implements OnInit {

  @ViewChild(TripTableComponent) tripsTable: TripTableComponent
  @ViewChild(PlaceTableComponent) placesTable: PlaceTableComponent
  @ViewChild(MapComponent) map: MapComponent
  
  myId: string;
  selections: ActiveSelections;

  markers: Marker[];
  
  constructor(
    public dialog: MatDialog,
    private tripService: TripService,
    private placeService: PlaceService,
    private snackBar : MatSnackBar,
    private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef,
    private auth: AuthService,
    private stateManagement: MapManagementService
    ) {
      this.selections = new ActiveSelections();
      this.markers = [];
      //   marker([ 46.778186, 6.641524 ], { icon: defaultIcon }),
      //   marker([ 46.780796, 6.647395 ], { icon: defaultIcon }),
      //   marker([ 46.784992, 6.652267 ], { icon: defaultIcon })
      // ];
    }
    
    ngOnInit(): void {
      this.auth.getUser().subscribe({
        next: (user) => {
          this.myId = user.id
        },
        error: _ => console.log('Cannot retrieve user id')
      });
    }
    
    openTripDialog(): Observable<any> {
      let tripForDialog: Trip;
      if(this.selections.isTripSelected()){
        tripForDialog = cloneDeep(this.selections.selectedTrip);
      }
      else{
        tripForDialog = new Trip();
      }

      const dialogConfig = new MatDialogConfig();
      
      const dialogRef = this.dialog.open(TripDialogComponent, {
        width: '500px',
        minHeight: '500px',
        data: tripForDialog
      });
      
      return dialogRef.afterClosed();
    }

    createNewTrip(): void {
      this.openTripDialog().subscribe(result => {
        // If dialog closed
        if(result === undefined) return;
        
        const tripRequest = new TripRequest(result);
        this.tripService.createNewTrip(tripRequest).subscribe({
          next: trip => {
            this.openSuccessSnackBar('Trip successfully created!');
            this.selections.selectedTrip = trip;
          },
          // Todo specify errors if time
          error: (err: HttpErrorResponse) => {
            this.openErrorSnackBar(err.error.message);
            console.log(err);
          }
        });
      }, 
      error => console.log(`Dialog error : ${error}`));
    }
    
    editSelectedTrip(): void {
      this.openTripDialog().subscribe(result => {
        // If dialog closed
        if(result === undefined) return;
        
        const tripRequest = new TripRequest(result);
        this.tripService.updateTrip(result.id, tripRequest).subscribe({
          next: trip => {
            this.openSuccessSnackBar('Trip successfully edited!');
            this.selections.selectedTrip = trip;
          },
          // Todo specify errors if time
          error: (err: HttpErrorResponse) => {
            this.openErrorSnackBar(err.error.message);
            console.log(err);
          }
        });
      }, error => console.log(`Dialog error : ${error}`));
      
    }
    
    deleteSelectedTrip(): void {
      if(confirm("Do you want to delete the trip?")){
        this.tripService.deleteTrip(this.selections.selectedTrip.id).subscribe({
          next: _ => {
            this.openSuccessSnackBar('Trip successfully deleted!');
            this.selections.removeSelectedTrip();
          },
          error: (err: HttpErrorResponse) => {
            this.openErrorSnackBar(err.error.message);
            console.log(err);
          }
        });
      }
    }
    
    openPlaceDialog(): Observable<any> {
      let placeForDialog: Place;
      if(this.selections.isPlaceSelected()){
        placeForDialog = cloneDeep(this.selections.selectedPlace);
      }
      else{
        placeForDialog = new Place();
      }
      const dialogRef = this.dialog.open(PlaceDialogComponent, {
        maxHeight: '90vh',
        disableClose: true,
        data: placeForDialog
      });
      return dialogRef.afterClosed();
    }

    createNewPlace(): void {
      this.openPlaceDialog().subscribe(place => {
        // Undefined means the dialog has been closed so just return
        if(place === undefined) return;
        // The user is creating a new place
        else{
          let placeRequest = new PlaceRequest(place);
          placeRequest.tripHref = this.selections.selectedTrip.href;
          placeRequest.tripId = this.selections.selectedTrip.id;
          
          this.placeService.createPlace(placeRequest).subscribe({
            next: place => {
              this.openSuccessSnackBar('Place successfully created!');
              this.selections.selectedPlace = place;
            },
            error: (err: HttpErrorResponse) => {
              this.openErrorSnackBar(err.error.message);
              console.log(err);
            }
          });
        }
      }, 
      error => console.log(`Dialog error : ${error}`));
    }

    editSelectedPlace(): void {
      this.openPlaceDialog().subscribe(place => {
        // Undefined means the dialog has been closed so just return
        if(place === undefined) return;
        // The user is editing the place
        else{
          let placeRequest = new PlaceRequest(place);
          placeRequest.tripHref = this.selections.selectedTrip.href;
          placeRequest.tripId = this.selections.selectedTrip.id;
          
          this.placeService.updatePlace(this.selections.selectedPlace.id, placeRequest).subscribe({
            next: place => {
              this.openSuccessSnackBar('Place successfully edited!');
              this.selections.selectedPlace = place;
            },
            error: (err: HttpErrorResponse) => {
              this.openErrorSnackBar(err.error.message);
              console.log(err);
            }
          });
        }
      },
      error => console.log(`Dialog error : ${error}`));
    }

    deleteSelectedPlace(): void {
      if(confirm("Do you want to delete this place?")){
        this.placeService.deletePlace(this.selections.selectedPlace.id).subscribe({
          next: place => {
            this.openSuccessSnackBar('Place successfully deleted!');
            this.selections.removeSelectedPlace();
          },
          error: (err: HttpErrorResponse) => {
            this.openErrorSnackBar(err.error.message);
            console.log(err);
          }
        })
      }
    }
    
    selectTrip(trip: Trip){
      if(this.selections.selectedTrip && this.selections.selectedTrip.id === trip.id){
        this.selections.removeSelectedTrip();
      }
      else{
        this.selections.selectedTrip = trip;
      } 
    }
    
    selectPlace(place: Place){
      if(this.selections.selectedPlace && this.selections.selectedPlace.id === place.id){
        this.selections.removeSelectedPlace();
      }
      else{
        this.selections.selectedPlace = place;
        /* Find a way to select the trip when clicking the place
        if(!this.selections.selectedTrip)
        this.tripService.retrieveTripsByHref(place.href).subscribe({
          next: trip => 
          {this.selections.selectedTrip = trip;
          }
        });*/
      } 
    }

    openErrorSnackBar(error: string) : void {
      let snackBarRef = this.snackBar.open(`${error}`, 'Quitter', {
        duration: 20000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });

      snackBarRef.onAction().subscribe( _ => snackBarRef.dismiss());
    }

    openSuccessSnackBar(message: string) : void {
      let snackBarRef = this.snackBar.open(`${message}`, 'Quitter', {
        duration: 5000,
        panelClass: ['mat-toolbar', 'mat-primary']
      });

      snackBarRef.onAction().subscribe( _ => snackBarRef.dismiss());
    }
  }
  