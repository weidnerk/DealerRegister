import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatSelectModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatIconModule } from '@angular/material';
// import { NoConflictStyleCompatibilityMode } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { DealerReviewComponent } from './dealerreview/dealerreview.component';
import { DealerService } from './_services/dealer.service';
import { DealerParamService } from './_services/dealerparam.service';
import { SignupService } from './_services/signup.service';
import { DealerReactiveComponent } from './dealerreactive/dealerreactive.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    DealerReviewComponent,
    DealerReactiveComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatToolbarModule,
    MatCheckboxModule,
     MatIconModule
    // ,
    // NoConflictStyleCompatibilityMode
  ],
  providers: [DealerService, DealerParamService, SignupService, {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
