import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Trip } from '../models/trip';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from '../api/services/trip.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-my-trips-page',
  templateUrl: './my-trips-page.component.html',
  styleUrls: ['./my-trips-page.component.scss']
})
export class MyTripsPageComponent implements OnInit {
  
  myTrips: Trip[];
  dataSource: MatTableDataSource<Trip>;
  selectedTrip: Trip;
  
  displayedColumns: string[] = ['title'];
  
  constructor(
    private tripService: TripService,
    private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef,
    private auth: AuthService
    ) {
      this.selectedTrip = new Trip();
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
    
    logRow(row){
      console.log(row);
      this.selectedTrip = this.selectedTrip.title === row.title ? new Trip(): row;
    }
    
    edit(row){
      console.log(`double ${row}`);
    }
    
  }
  