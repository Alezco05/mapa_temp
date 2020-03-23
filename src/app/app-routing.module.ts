import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormComponent } from './components/form/form.component';
import { MapComponent } from './components/map/map.component';
import { ReportesComponent } from './components/reportes/reportes.component';

const routes: Routes = [
  {path: '', component: FormComponent, pathMatch: 'full'},
  {path: 'formulario', component: FormComponent},
  {path: 'mapa', component: MapComponent},
  {path: 'reportes', component: ReportesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
