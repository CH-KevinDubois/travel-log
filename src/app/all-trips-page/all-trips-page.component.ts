import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Trip } from '../models/trip';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from '../api/services/trip.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-all-trips-page',
  templateUrl: './all-trips-page.component.html',
  styleUrls: ['./all-trips-page.component.scss']
})
export class AllTripsPageComponent implements OnInit {

  allTrips: Trip[];
  dataSource: MatTableDataSource<Trip>;
  selectedTrip: Trip;
  
  displayedColumns: string[] = ['title'];

  constructor(
    private tripService: TripService,
    private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.selectedTrip = new Trip();
   }

  ngOnInit(): void {
    this.retrieveAllTrips();
  }

  retrieveAllTrips(){
    this.tripService.retrieveAllTrips().subscribe({
      next: (trips) => {
        this.dataSource = new MatTableDataSource(trips);
        //this.changeDetectorRefs.detectChanges();
      },
      error: err => {
        console.log(err.status);
      }
    })
  }

  logRow(row){
    console.log(row);
    this.selectedTrip = this.selectedTrip.title === row.title ? new Trip(): row;
  }

  edit(row){
    console.log(`double ${row}`);
  }

}
