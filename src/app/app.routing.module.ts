import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ManufacturerModule } from './manufacturers/manufacturers.module';
import {AuthFormsGuard, AuthGuard} from './_helpers';
import {Role} from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

const manufacturerModule = () => import('./manufacturers/manufacturers.module').then(x => x.ManufacturerModule);
const productModule = () => import('./products/product.module').then(x => x.ProductModule);

const routes: Routes = [
  { path: '', redirectTo: '/account/signin', pathMatch: 'full' },
  { path: 'account', loadChildren: accountModule, canActivate: [AuthFormsGuard] },
  { path: 'users', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
  { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
  { path: 'manufacturers', loadChildren: manufacturerModule, canActivate: [AuthGuard]},
  { path: 'products', loadChildren: productModule, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/account/signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
