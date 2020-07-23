import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { UserService } from "../api/services/user.service";
import { TripService } from '../api/services/trip.service';
import { TripRequest } from '../models/trip-request';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../models/trip';
import { environment } from 'src/environments/environment';
import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, DialogPosition, MatDialogConfig } from '@angular/material/dialog';
import { TripDialogComponent } from '../api/dialogs/trip-dialog/trip-dialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: "app-dummy-page",
  templateUrl: "./dummy-page.component.html",
  styleUrls: ["./dummy-page.component.scss"],
})
export class DummyPageComponent implements OnInit {

  tripRequest: TripRequest;
  personnalTrips: Trip[] = new Array<Trip>();
  allTrips: Trip[];
  dataSource: MatTableDataSource<Trip>;
  selectedTrip: Trip;

  usernameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  displayedColumns: string[] = ['id', 'title', 'description', 'userHref'];
  
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource = ELEMENT_DATA;

  // Inject the UserService
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private tripService: TripService,
    private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef
    ) {
      this.tripRequest = new TripRequest();
      this.selectedTrip = new Trip();
    }

  ngOnInit(): void {
    this.retrieveAllTrips(new Event("le"));
    // Ask the service to make an API call on component initialisation
    this.userService.loadAllUsers().subscribe({
      next: (users) => console.log("Users", users),
      error: (error) => console.warn("Error", error),
    });
  }

  addTrip(form: NgForm): void {
    if(form.valid){
      this.tripService.createTrip(this.tripRequest).subscribe({
        next: (trip) => console.log(trip)
      })
    }
  }

  retrievePersonalTrips(){
    //Todo
  }

  retrieveAllTrips(e : Event){
    e.preventDefault();
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

  openDialog(): void {
    console.log(this.selectedTrip);
    const dialogConfig = new MatDialogConfig();

    const dialogRef = this.dialog.open(TripDialogComponent, {
      width: '500px',
      maxHeight: '500px',
      data: this.selectedTrip
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result === undefined) return;
      this.selectedTrip = result;
    });
    
  }
}
