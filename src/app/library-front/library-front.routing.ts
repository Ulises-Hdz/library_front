import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home.component';
import { LibraryFrontLayoutComponent } from './layouts/library-front-layout/library-front-layout.component';
import { BooksPageComponent } from './pages/books-page/books-page.component';
import { LoansPageComponent } from './pages/loans-page/loans-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const libraryFrontRoutes: Routes = [
  { 
    path: '',
    component: LibraryFrontLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomePageComponent
      },
      {
        path: 'books',
        component: BooksPageComponent
      },
      {
        path: 'loans',
        component: LoansPageComponent
      },
      {
        path: '**',
        component: NotFoundPageComponent
      }
    ]
  }
];

export default libraryFrontRoutes;

