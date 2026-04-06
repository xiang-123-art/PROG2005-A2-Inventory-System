/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 2
 * Angular Inventory Management App
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// Ensure correct configuration is used at startup, and print errors for troubleshooting
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Angular startup failed:', err));