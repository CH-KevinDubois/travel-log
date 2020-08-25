import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {

  constructor(private snackBar : MatSnackBar,) { }

  openErrorNotification(error: string) : void {
    let snackBarRef = this.snackBar.open(`${error}`, 'Quitter', {
      duration: 20000,
      panelClass: ['mat-toolbar', 'mat-warn']
    });

    snackBarRef.onAction().subscribe( _ => snackBarRef.dismiss());
  }

  openSuccessNotification(message: string) : void {
    let snackBarRef = this.snackBar.open(`${message}`, 'Quitter', {
      duration: 5000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });

    snackBarRef.onAction().subscribe( _ => snackBarRef.dismiss());
  }
}
