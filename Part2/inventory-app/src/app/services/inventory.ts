/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 2
 * Angular Inventory Management App
 */
import { Injectable } from '@angular/core';
import { Category, InventoryItem, PopularStatus, StockStatus } from '../models/inventory-item';

@Injectable({
  providedIn: 'root' // 全局可用，不用额外配置
})
export class InventoryService {
  // 库存数据存储（会话内持久化，浏览器开着数据就存在）
  private inventoryList: InventoryItem[] = [
    {
      itemId: "001",
      itemName: "Wireless Headphones",
      category: Category.Electronics,
      quantity: 50,
      price: 199.99,
      supplierName: "Audio Tech Ltd",
      stockStatus: StockStatus.InStock,
      popularItem: PopularStatus.Yes,
      comment: "Best seller for 2026"
    },
    {
      itemId: "002",
      itemName: "Office Desk",
      category: Category.Furniture,
      quantity: 5,
      price: 299.99,
      supplierName: "Furniture World",
      stockStatus: StockStatus.LowStock,
      popularItem: PopularStatus.No
    }
  ];

  constructor() { }

  // 1. 获取所有商品
  getAllItems(): InventoryItem[] {
    return [...this.inventoryList];
  }

  // 2. 获取热门商品
  getPopularItems(): InventoryItem[] {
    return this.inventoryList.filter(item => item.popularItem === PopularStatus.Yes);
  }

  // 3. 按名称搜索商品
  searchItemsByName(keyword: string): InventoryItem[] {
    const lowerKeyword = keyword.trim().toLowerCase();
    return this.inventoryList.filter(item => item.itemName.toLowerCase().includes(lowerKeyword));
  }

  // 4. 按名称查找单个商品
  getItemByName(itemName: string): InventoryItem | undefined {
    return this.inventoryList.find(item => item.itemName.toLowerCase() === itemName.trim().toLowerCase());
  }

  // 5. 添加商品
  addItem(item: InventoryItem): { success: boolean; message: string } {
    // 校验ID唯一性
    if (this.inventoryList.some(i => i.itemId === item.itemId)) {
      return { success: false, message: "Error: Item ID already exists, must be unique!" };
    }
    // 校验必填项
    if (!item.itemId || !item.itemName || !item.category || !item.supplierName || !item.popularItem) {
      return { success: false, message: "Error: All fields except comment are required!" };
    }
    // 校验数值
    if (item.quantity < 0 || item.price <= 0) {
      return { success: false, message: "Error: Quantity cannot be negative, price must be greater than 0!" };
    }

    // 自动更新库存状态
    item.stockStatus = this.updateStockStatus(item.quantity);
    this.inventoryList.push(item);
    return { success: true, message: "Item added successfully!" };
  }

  // 6. 按名称更新商品
  updateItemByName(itemName: string, updatedData: Partial<InventoryItem>): { success: boolean; message: string } {
    const itemIndex = this.inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.trim().toLowerCase());
    if (itemIndex === -1) {
      return { success: false, message: "Error: Item not found!" };
    }

    // 校验数值
    if (updatedData.quantity !== undefined && updatedData.quantity < 0) {
      return { success: false, message: "Error: Quantity cannot be negative!" };
    }
    if (updatedData.price !== undefined && updatedData.price <= 0) {
      return { success: false, message: "Error: Price must be greater than 0!" };
    }

    // 更新数据
    this.inventoryList[itemIndex] = {
      ...this.inventoryList[itemIndex],
      ...updatedData
    };

    // 更新库存状态
    if (updatedData.quantity !== undefined) {
      this.inventoryList[itemIndex].stockStatus = this.updateStockStatus(updatedData.quantity);
    }

    return { success: true, message: "Item updated successfully!" };
  }

  // 7. 按名称删除商品
  deleteItemByName(itemName: string): { success: boolean; message: string } {
    const itemIndex = this.inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.trim().toLowerCase());
    if (itemIndex === -1) {
      return { success: false, message: "Error: Item not found!" };
    }

    this.inventoryList.splice(itemIndex, 1);
    return { success: true, message: "Item deleted successfully!" };
  }

  // 工具函数：根据数量自动更新库存状态
  private updateStockStatus(quantity: number): StockStatus {
    if (quantity <= 0) return StockStatus.OutOfStock;
    if (quantity <= 10) return StockStatus.LowStock;
    return StockStatus.InStock;
  }
}