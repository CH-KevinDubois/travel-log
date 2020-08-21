import { Component, OnInit, Inject, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Place } from 'src/app/models/place';
import { StateManagementService } from '../../services/state-management.service';
import { Observer, Observable, Subscription } from 'rxjs';
import { GeoJsonLocation } from 'src/app/models/geo-json-location';

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

  constructor(
    public dialogRef: MatDialogRef<PlaceDialogComponent>,
    private stateManagement: StateManagementService,
    @Inject(MAT_DIALOG_DATA) public place: Place) 
    {
      this.nameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
      this.descriptionControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50000)]); 
      this.pictureUrlControl = new FormControl('', [Validators.minLength(10), Validators.maxLength(500)]);
      this.longitudeControl = new FormControl('', [Validators.min(-180), Validators.max(180)]);
      this.latitudeControl = new FormControl('', [Validators.min(-90), Validators.max(90)]);  
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    ngOnInit(): void {

      this.mapClickedSubscription = this.stateManagement.getClickedPointOnMapSubject().subscribe({
        next: location => {
          this.place.location.coordinates[0] = location.coordinates[0];
          this.place.location.coordinates[1] = location.coordinates[1];
        }
      });
    }

    ngOnDestroy(): void {
      this.mapClickedSubscription.unsubscribe();
    }
  }
  