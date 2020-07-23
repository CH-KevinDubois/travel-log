import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon'; 
import { MatLineModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'; 
import { MatMenuModule, matMenuAnimations } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table'; 
import { MatDialogModule, MatDialogContent } from '@angular/material/dialog'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DummyPageComponent } from './dummy-page/dummy-page.component';
import { ApiTokenInterceptorService } from './api/api-token-interceptor.service';
import { SecurityModule } from './security/security.module';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TripDialogComponent } from './api/dialogs/trip-dialog/trip-dialog.component';
import { PlaceDialogComponent } from './api/dialogs/place-dialog/place-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    DummyPageComponent,
    NavbarComponent,
    TripDialogComponent,
    PlaceDialogComponent,
  ],
  entryComponents: [
    TripDialogComponent
  ],
  imports: [
    SecurityModule,
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule, 
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    RouterModule, 
    MatDialogModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiTokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
