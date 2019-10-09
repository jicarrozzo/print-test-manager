import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
	{ path: 'form-test', loadChildren: './pages/form-test/form-test.module#FormTestPageModule' },
	{ path: 'foto', loadChildren: './pages/foto/foto.module#FotoPageModule' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
