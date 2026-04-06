/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 2
 * Angular Inventory Management App
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// 确保启动时使用正确的配置，同时打印错误方便排查
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Angular启动失败:', err));