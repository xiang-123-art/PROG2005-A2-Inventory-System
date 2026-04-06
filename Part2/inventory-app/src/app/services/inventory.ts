/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 2
 * Angular Inventory Management App
 */
import { Injectable } from '@angular/core';
import { Category, InventoryItem, PopularStatus, StockStatus } from '../models/inventory-item';

@Injectable({
  providedIn: 'root' // Global availability, no additional configuration needed
})
export class InventoryService {
  // Inventory data storage (session persistence, data exists while browser is open)
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

  // 1. Get all items
  getAllItems(): InventoryItem[] {
    return [...this.inventoryList];
  }

  // 2. Get popular items
  getPopularItems(): InventoryItem[] {
    return this.inventoryList.filter(item => item.popularItem === PopularStatus.Yes);
  }

  // 3. Search items by name
  searchItemsByName(keyword: string): InventoryItem[] {
    const lowerKeyword = keyword.trim().toLowerCase();
    return this.inventoryList.filter(item => item.itemName.toLowerCase().includes(lowerKeyword));
  }

  // 4. Get single item by name
  getItemByName(itemName: string): InventoryItem | undefined {
    return this.inventoryList.find(item => item.itemName.toLowerCase() === itemName.trim().toLowerCase());
  }

  // 5. Add item
  addItem(item: InventoryItem): { success: boolean; message: string } {
    // Validate ID uniqueness
    if (this.inventoryList.some(i => i.itemId === item.itemId)) {
      return { success: false, message: "Error: Item ID already exists, must be unique!" };
    }
    // Validate required fields
    if (!item.itemId || !item.itemName || !item.category || !item.supplierName || !item.popularItem) {
      return { success: false, message: "Error: All fields except comment are required!" };
    }
    // Validate numeric values
    if (item.quantity < 0 || item.price <= 0) {
      return { success: false, message: "Error: Quantity cannot be negative, price must be greater than 0!" };
    }

    // Auto-update stock status
    item.stockStatus = this.updateStockStatus(item.quantity);
    this.inventoryList.push(item);
    return { success: true, message: "Item added successfully!" };
  }

  // 6. Update item by name
  updateItemByName(itemName: string, updatedData: Partial<InventoryItem>): { success: boolean; message: string } {
    const itemIndex = this.inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.trim().toLowerCase());
    if (itemIndex === -1) {
      return { success: false, message: "Error: Item not found!" };
    }

    // Validate numeric values
    if (updatedData.quantity !== undefined && updatedData.quantity < 0) {
      return { success: false, message: "Error: Quantity cannot be negative!" };
    }
    if (updatedData.price !== undefined && updatedData.price <= 0) {
      return { success: false, message: "Error: Price must be greater than 0!" };
    }

    // Update data
    this.inventoryList[itemIndex] = {
      ...this.inventoryList[itemIndex],
      ...updatedData
    };

    // Update stock status
    if (updatedData.quantity !== undefined) {
      this.inventoryList[itemIndex].stockStatus = this.updateStockStatus(updatedData.quantity);
    }

    return { success: true, message: "Item updated successfully!" };
  }

  // 7. Delete item by name
  deleteItemByName(itemName: string): { success: boolean; message: string } {
    const itemIndex = this.inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.trim().toLowerCase());
    if (itemIndex === -1) {
      return { success: false, message: "Error: Item not found!" };
    }

    this.inventoryList.splice(itemIndex, 1);
    return { success: true, message: "Item deleted successfully!" };
  }

  // Utility function: Auto-update stock status based on quantity
  private updateStockStatus(quantity: number): StockStatus {
    if (quantity <= 0) return StockStatus.OutOfStock;
    if (quantity <= 10) return StockStatus.LowStock;
    return StockStatus.InStock;
  }
}