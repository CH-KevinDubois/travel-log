import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Place } from 'src/app/models/place';

@Component({
  selector: 'app-place-dialog',
  templateUrl: './place-dialog.component.html',
  styleUrls: ['./place-dialog.component.scss']
})
export class PlaceDialogComponent implements OnInit {
  
  nameControl: FormControl;
  descriptionControl: FormControl;
  pictureUrlControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<PlaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public place: Place) 
    {
      this.nameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
      this.descriptionControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50000)]); 
      this.pictureUrlControl = new FormControl('', [Validators.minLength(10), Validators.maxLength(500)]);  
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    ngOnInit(): void {
    }
  }
  