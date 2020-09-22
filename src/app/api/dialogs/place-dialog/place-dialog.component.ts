import { Component, OnInit, Inject, OnDestroy, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Place } from 'src/app/models/place';
import { MapManagementService } from '../../services/map-management.service';
import { Observer, Observable, Subscription } from 'rxjs';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';
import { latLng, LatLng } from 'leaflet';
import { MapComponent } from 'src/app/map/map.component';

@Component({
  selector: 'app-place-dialog',
  templateUrl: './place-dialog.component.html',
  styleUrls: ['./place-dialog.component.scss']
})
export class PlaceDialogComponent implements OnInit {
  
  nameControl: FormControl;
  descriptionControl: FormControl;
  pictureUrlControl: FormControl;
  longitudeControl: FormControl;
  latitudeControl: FormControl;

  mapClickedSubscription: Subscription;

  @ViewChild(MapComponent) map: MapComponent;

  constructor(
    public dialogRef: MatDialogRef<PlaceDialogComponent>,
    private mapManagement: MapManagementService,
    @Inject(MAT_DIALOG_DATA) public place: Place) 
    {
      this.nameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
      this.descriptionControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50000)]); 
      this.pictureUrlControl = new FormControl('', [Validators.minLength(10), Validators.maxLength(500)]);
      this.longitudeControl = new FormControl('', [Validators.min(-180), Validators.max(180)]);
      this.latitudeControl = new FormControl('', [Validators.min(-90), Validators.max(90)]);  

      if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition( (position) => {
          const latLng = new LatLng(position.coords.latitude, position.coords.longitude); 
          this.map.drawCircle(latLng);
          this.map.setZoom(14);
          this.map.focusCoordinates(latLng);
        });
      }
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    ngOnInit(): void {

      this.mapClickedSubscription = this.mapManagement.clickedPointOnMap$.subscribe({
        next: location => {
          this.place.location.coordinates[0] = location.coordinates[0];
          this.place.location.coordinates[1] = location.coordinates[1];
        }
      });
    }

    ngAfterInit(): void {

    }

    ngOnDestroy(): void {
      this.mapClickedSubscription.unsubscribe();
    }
  }
  