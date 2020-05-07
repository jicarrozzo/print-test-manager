import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HelpdeskvideosPage } from './helpdeskvideos.page';

const routes: Routes = [
  {
    path: '',
    component: HelpdeskvideosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HelpdeskvideosPage]
})
export class HelpdeskvideosPageModule {}
