import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Trip } from 'src/app/models/trip';

@Component({
  selector: 'app-trip-dialog',
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip-dialog.component.scss']
})
export class TripDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Trip) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }

  ngOnInit(): void {
  }

}
