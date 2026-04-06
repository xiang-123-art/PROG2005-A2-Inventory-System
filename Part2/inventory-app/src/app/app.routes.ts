/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 2
 * Angular Inventory Management App
 */
import { Routes } from '@angular/router';
// Adapted to new Angular simplified file naming (removed .component suffix)
import { HomeComponent } from './pages/home/home';
import { InventoryManageComponent } from './pages/inventory-manage/inventory-manage';
import { ItemSearchComponent } from './pages/item-search/item-search';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security';
import { HelpComponent } from './pages/help/help';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventory-manage', component: InventoryManageComponent },
  { path: 'item-search', component: ItemSearchComponent },
  { path: 'privacy-security', component: PrivacySecurityComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '' }
];