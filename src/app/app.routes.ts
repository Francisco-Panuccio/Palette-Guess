import { Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Palette Guess - Home'
  },
  {
    path: 'characters-mode',
    loadComponent: () => import('./pages/characters-mode/characters-mode.component').then((m) => m.CharactersModeComponent),
    title: 'Palette Guess - Characters Mode'
  },
  {
    path: 'chromatic-mode',
    loadComponent: () => import('./pages/chromatic-mode/chromatic-mode.component').then((m) => m.ChromaticModeComponent),
    title: 'Palette Guess - Chromatic Mode'
  },
  {
    path: 'challenge-mode',
    loadComponent: () => import('./pages/challenge-mode/challenge-mode.component').then((m) => m.ChallengeModeComponent),
    title: 'Palette Guess - Challenge Mode'
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: 'Palette Guess - Error'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: ErrorComponent,
    title: 'Palette Guess - Error'
  }
];
