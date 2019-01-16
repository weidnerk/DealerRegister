import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealerReviewComponent } from './dealerreview/dealerreview.component';
import { DealerReactiveComponent } from './dealerreactive/dealerreactive.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppComponent } from './app.component';

const routes: Routes = [
    {
        path: 'dealerreview', component: DealerReviewComponent
    },
    {
        path: 'dealerreactive', component: DealerReactiveComponent
    },
    {
        path: 'welcome', component: WelcomeComponent
    },
    {
        path: '', redirectTo: '/dealerreactive', pathMatch: 'full'
    }
    // ,
    // {
    //     path: '**', redirectTo: 'dealerreactive'
    // }
];

export const routing = RouterModule.forRoot(routes);
