import { Routes } from '@angular/router';
import { adminGuard } from './auth/admin.guard';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    // Boutique : bandeau, header et footer
    path: '',
    loadComponent: () => import('./layouts/client-layout'),
    children: [
      { path: '', loadComponent: () => import('./pages/client/home/home') },
      { path: 'connexion', title: 'Connexion – Fshop', loadComponent: () => import('./pages/client/login/login') },
      {
        path: 'produits',
        title: 'Tous les produits – Fshop',
        loadComponent: () => import('./pages/client/catalog/catalog'),
      },
      {
        path: 'promos',
        title: 'Promotions – Fshop',
        data: { mode: 'promos' },
        loadComponent: () => import('./pages/client/catalog/catalog'),
      },
      {
        path: 'categorie/:slug',
        title: 'Catégorie – Fshop',
        loadComponent: () => import('./pages/client/catalog/catalog'),
      },
      {
        path: 'produit/:id',
        title: 'Produit – Fshop',
        loadComponent: () => import('./pages/client/product/product'),
      },
      { path: 'panier', title: 'Mon panier – Fshop', loadComponent: () => import('./pages/client/cart/cart') },
      {
        path: 'commande',
        title: 'Commander – Fshop',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/client/checkout/checkout'),
      },
      {
        path: 'commandes',
        title: 'Mes commandes – Fshop',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/client/orders/order-list'),
      },
      {
        path: 'commandes/:id',
        title: 'Détail de la commande – Fshop',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/client/orders/order-detail'),
      },
    ],
  },
  {
    // Back-office : réservé aux comptes ADMIN
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout'),
    children: [
      {
        path: '',
        title: 'Tableau de bord – Administration Fshop',
        loadComponent: () => import('./pages/admin/dashboard/dashboard'),
      },
      {
        path: 'produits',
        title: 'Produits – Administration Fshop',
        loadComponent: () => import('./pages/admin/products/product-list'),
      },
      {
        path: 'produits/nouveau',
        title: 'Nouveau produit – Administration Fshop',
        loadComponent: () => import('./pages/admin/products/product-form'),
      },
      {
        path: 'produits/:id',
        title: 'Modifier un produit – Administration Fshop',
        loadComponent: () => import('./pages/admin/products/product-form'),
      },
      {
        path: 'categories',
        title: 'Catégories – Administration Fshop',
        loadComponent: () => import('./pages/admin/categories/category-list'),
      },
      {
        path: 'commandes',
        title: 'Commandes – Administration Fshop',
        loadComponent: () => import('./pages/admin/orders/order-list'),
      },
    ],
  },
];
