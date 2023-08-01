import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistreComponent } from './components/registre/registre.component';

const routes: Routes = [
  {
    path:'admin' ,
    loadChildren:() => import ('./admin/admin.module').then(m => m.AdminModule)
  } ,
  {path:'login' , component :LoginComponent} ,
  {path:'registre' , component:RegistreComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
