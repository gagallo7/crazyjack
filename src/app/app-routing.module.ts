import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './materials.module';
import { DashComponent } from './dash/dash.component';
import { CardsComponent } from './cards/cards.component';
import { DdComponent } from './dd/dd.component';

const routes: Routes = [
  {path: 'dash', component: DashComponent},
  {path: '', component: CardsComponent},
  {path: 'dd', component: DdComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MaterialModule],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule {}
