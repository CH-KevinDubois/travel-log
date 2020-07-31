import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './security/login-page/login-page.component';
import { DummyPageComponent } from './dummy-page/dummy-page.component';
import { AuthGuard } from './security/guards/auth.guard';
import { RegisterPageComponent } from './security/register-page/register-page.component';
import { AllTripsPageComponent } from './all-trips-page/all-trips-page.component';
import { MyTripsPageComponent } from './my-trips-page/my-trips-page.component';


const routes: Routes = [
  { path: "", redirectTo: "all-trips", pathMatch: "full" },
  { path: "all-trips", component: AllTripsPageComponent },
  { path: "login", component: LoginPageComponent },
  { path: "register", component:  RegisterPageComponent},
  //{ path: "**", component: ErrorPageComponent},
  {
    path: "dummy", component: DummyPageComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  {
    path: "my-trips", component: MyTripsPageComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
