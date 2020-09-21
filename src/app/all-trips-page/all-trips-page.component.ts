import { Component, OnInit } from '@angular/core';
import { Trip } from '../models/trip';
import { Place } from '../models/place';
import { DataManagementService } from '../api/services/data-management.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-trips-page',
  templateUrl: './all-trips-page.component.html',
  styleUrls: ['./all-trips-page.component.scss']
})
export class AllTripsPageComponent implements OnInit {

  isTripSelected: boolean;
  isPlaceSelected: boolean;
  selectedTrip: Trip;
  selectedPlace: Place;

  idPlace: number;
  idTrip: number;

  subscriptionTable : Subscription[] = new Array<Subscription>();
  
  constructor(
    private dataManagement: DataManagementService,
    private route: ActivatedRoute,
    private location: Location
    ) {
      this.dataManagement.reset();  
    }
    
    ngOnInit(): void {
      this.subscriptionTable.push(this.dataManagement.isTripSelected$.subscribe({
        next: value => this.isTripSelected = value
      }));

      this.subscriptionTable.push(this.dataManagement.isPlaceSelected$.subscribe({
        next: value => this.isPlaceSelected = value
      }));

      this.subscriptionTable.push(this.dataManagement.selectedTrip$.subscribe({
        next: value => {
          this.selectedTrip = value;
          // Display the trip id in the url (without redirection)
          if (this.isTripSelected)
            this.location.go(this.route.snapshot.url.join('/') 
              + '/' + this.selectedTrip.id);
          else
            this.location.go(this.route.snapshot.url.join('/'));
        }
      }));

      this.subscriptionTable.push(this.dataManagement.selectedPlace$.subscribe({
        next: value => {
          this.selectedPlace = value;
          // Display the trip/place id in the url (without redirection)
          if (this.isTripSelected && this.isPlaceSelected) {
            this.location.go(this.route.snapshot.url.join('/') 
              + '/' + this.selectedTrip.id
              + '/' + this.selectedPlace.id);
          }
          else if (this.isPlaceSelected) {
            this.location.go(this.route.snapshot.url.join('/') 
              + '/' + this.selectedPlace.id);
          }
          else if (this.isTripSelected) {
            this.location.go(this.route.snapshot.url.join('/') 
              + '/' + this.selectedTrip.id);
            }
          else
            this.location.go(this.route.snapshot.url.join('/'));
        }
      }));
    }

    ngOnDestroy(): void{
      this.subscriptionTable.forEach(
        subscription => subscription.unsubscribe()
      );
    }
  }
