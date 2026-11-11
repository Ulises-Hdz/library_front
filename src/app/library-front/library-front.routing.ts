import { Routes } from '@angular/router';
import { adminGuard, authGuard } from '../auth/guards/auth.guard';
import { InventoryPageComponent } from './pages/admin/inventory/inventory-page.component';
import { AdminLoansPageComponent } from './pages/admin/loans/admin-loans-page.component';
import { UsersPageComponent } from './pages/admin/users/users-page.component';
import { HomePageComponent } from './pages/home-page/home.component';
import { LibraryFrontLayoutComponent } from './layouts/library-front-layout/library-front-layout.component';
import { BooksPageComponent } from './pages/books-page/books-page.component';
import { LoansPageComponent } from './pages/loans-page/loans-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { PdfReaderPageComponent } from './pages/pdf-reader/pdf-reader-page.component';

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
        path: 'read/:id',
        component: PdfReaderPageComponent,
        canActivate: [authGuard]
      },
      {
        path: 'loans',
        component: LoansPageComponent
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: 'inventory', component: InventoryPageComponent },
          { path: 'loans', component: AdminLoansPageComponent },
          { path: 'users', component: UsersPageComponent },
        ]
      },
      {
        path: '**',
        component: NotFoundPageComponent
      }
    ]
  }
];

export default libraryFrontRoutes;


