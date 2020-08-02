import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Trip } from 'src/app/models/trip';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-trip-dialog',
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip-dialog.component.scss']
})
export class TripDialogComponent implements OnInit {

  titleControl: FormControl;
  descriptionControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<TripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Trip) 
  {
    this.titleControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.descriptionControl = new FormControl('', [Validators.required, Validators.minLength(4)]);  
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  
  }

}
