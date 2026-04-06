import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category, InventoryItem, PopularStatus, StockStatus } from '../../models/inventory-item';
import { InventoryService } from '../../services/inventory';

@Component({
  selector: 'app-inventory-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-manage.html',
  styleUrls: ['./inventory-manage.css'],
})
export class InventoryManageComponent {
  addItemForm: FormGroup;
  updateItemForm: FormGroup;
  deleteItemForm: FormGroup;
  message: string = '';
  isError: boolean = false;
  categories = Object.values(Category);
  popularOptions = Object.values(PopularStatus);

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {
    this.addItemForm = this.fb.group({
      itemId: ['', [Validators.required]],
      itemName: ['', [Validators.required]],
      category: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      supplierName: ['', [Validators.required]],
      popularItem: ['', [Validators.required]],
      comment: ['']
    });

    this.updateItemForm = this.fb.group({
      itemName: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      supplierName: ['', [Validators.required]],
      popularItem: ['', [Validators.required]],
      comment: ['']
    });

    this.deleteItemForm = this.fb.group({
      itemName: ['', [Validators.required]]
    });
  }

  private showMessage(message: string, isError: boolean = false) {
    this.message = message;
    this.isError = isError;
    setTimeout(() => { this.message = ''; }, 3000);
  }

  onAddItem() {
    if (this.addItemForm.invalid) {
      this.showMessage('Error: Please fill all required fields correctly!', true);
      return;
    }

    const newItem: InventoryItem = {
      ...this.addItemForm.value,
      stockStatus: StockStatus.InStock
    };

    const result = this.inventoryService.addItem(newItem);
    this.showMessage(result.message, !result.success);

    if (result.success) {
      this.addItemForm.reset();
    }
  }

  onUpdateItem() {
    if (this.updateItemForm.invalid) {
      this.showMessage('Error: Please fill all required fields correctly!', true);
      return;
    }

    const itemName = this.updateItemForm.value.itemName;
    const updatedData = this.updateItemForm.value;
    delete updatedData.itemName;

    const result = this.inventoryService.updateItemByName(itemName, updatedData);
    this.showMessage(result.message, !result.success);

    if (result.success) {
      this.updateItemForm.reset();
    }
  }

  onDeleteItem() {
    if (this.deleteItemForm.invalid) {
      this.showMessage('Error: Please enter the item name to delete!', true);
      return;
    }

    const itemName = this.deleteItemForm.value.itemName;
    const isConfirm = confirm(`Are you sure you want to delete item "${itemName}"? This action cannot be undone!`);
    
    if (!isConfirm) return;

    const result = this.inventoryService.deleteItemByName(itemName);
    this.showMessage(result.message, !result.success);

    if (result.success) {
      this.deleteItemForm.reset();
    }
  }

  clearForm(form: FormGroup) {
    form.reset();
  }
}