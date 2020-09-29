import { Component, OnInit } from '@angular/core';
import { Trip } from '../models/trip';
import { Place } from '../models/place';
import { DataManagementService } from '../api/services/data-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../security/auth.service';

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

  userAuthenticated: boolean;

  idPlace: number;
  idTrip: number;

  subscriptionTable : Subscription[] = new Array<Subscription>();
  
  constructor(
    private auth: AuthService,
    private dataManagement: DataManagementService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router
    ) {
      this.dataManagement.reset();  
    }
    
    ngOnInit(): void {
      this.subscriptionTable.push(this.auth.isAuthenticated().subscribe({
        next: (value) => this.userAuthenticated = value,
        error: (error) => {
          this.userAuthenticated = false;
          console.log(error);
        }
      }));

      this.subscriptionTable.push(this.dataManagement.isTripSelected$.subscribe({
        next: value => this.isTripSelected = value
      }));

      this.subscriptionTable.push(this.dataManagement.isPlaceSelected$.subscribe({
        next: value => this.isPlaceSelected = value
      }));

      this.subscriptionTable.push(this.dataManagement.selectedTrip$.subscribe({
        next: value => {
          this.selectedTrip = value;

          // Display the tripId as queryParam in the url (without redirection)
          let url: string;
          if (this.isTripSelected)
            url = this.router.createUrlTree([], 
              {relativeTo: this.activatedRoute, 
                queryParams: {tripId: this.selectedTrip.id}}).toString();
          else
            url = this.router.createUrlTree([], 
              {relativeTo: this.activatedRoute}).toString();

          this.location.go(url);
        }
      }));

      this.subscriptionTable.push(this.dataManagement.selectedPlace$.subscribe({
        next: value => {
          this.selectedPlace = value;

          // Display the tripId/placeId as queryParam in the url (without redirection)
          let url: string;
          if (this.isTripSelected && this.isPlaceSelected) {
            url = this.router.createUrlTree([], 
              {relativeTo: this.activatedRoute, 
                queryParams: {tripId: this.selectedTrip.id, 
                  placeId: this.selectedPlace.id}}).toString();
          }
          else if (this.isPlaceSelected) {
            url = this.router.createUrlTree([], 
              {relativeTo: this.activatedRoute, 
                queryParams: {placeId: this.selectedPlace.id}}).toString()
          }
          else if (this.isTripSelected) {
            url = this.router.createUrlTree([], 
              {relativeTo: this.activatedRoute, 
                queryParams: {tripId: this.selectedTrip.id}}).toString()
            }
          else
            url = this.router.createUrlTree([], 
              {relativeTo: this.activatedRoute}).toString();
              
          this.location.go(url);
        }
      }));
    }

    ngOnDestroy(): void{
      this.subscriptionTable.forEach(
        subscription => subscription.unsubscribe()
      );
    }
  }
