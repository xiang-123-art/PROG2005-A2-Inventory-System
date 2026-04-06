/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 2
 * Angular Inventory Management App
 */
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // 正式版无 Zone 模式（去掉了 Experimental）
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(BrowserModule, CommonModule, ReactiveFormsModule)
  ]
};