import { Routes } from '@angular/router';
import { Spinwheel } from './spinwheel/spinwheel';

export const routes: Routes = [
    { path: '', redirectTo: '/spinwheel', pathMatch: 'full' },
    {path: 'spinwheel', component: Spinwheel },
];
