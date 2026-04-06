import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryItem } from '../../models/inventory-item';
import { InventoryService } from '../../services/inventory';

@Component({
  selector: 'app-item-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-search.html',
  styleUrls: ['./item-search.css'],
})
export class ItemSearchComponent implements OnInit {
  searchForm: FormGroup;
  itemList: InventoryItem[] = [];
  message: string = '';
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {
    this.searchForm = this.fb.group({
      keyword: ['']
    });
  }

  ngOnInit(): void {
    this.showAllItems();
  }

  private showMessage(message: string, isError: boolean = false) {
    this.message = message;
    this.isError = isError;
    setTimeout(() => { this.message = ''; }, 3000);
  }

  onSearch() {
    const keyword = this.searchForm.value.keyword;
    if (!keyword.trim()) {
      this.showMessage('Please enter a search keyword!', true);
      return;
    }

    this.itemList = this.inventoryService.searchItemsByName(keyword);
    if (this.itemList.length === 0) {
      this.showMessage('No matching items found', true);
    } else {
      this.showMessage(`Found ${this.itemList.length} matching items`);
    }
  }

  showAllItems() {
    this.itemList = this.inventoryService.getAllItems();
    this.searchForm.reset();
    this.showMessage(`Displaying all ${this.itemList.length} items`);
  }

  showPopularItems() {
    this.itemList = this.inventoryService.getPopularItems();
    this.searchForm.reset();
    if (this.itemList.length === 0) {
      this.showMessage('No popular items found', true);
    } else {
      this.showMessage(`Displaying ${this.itemList.length} popular items`);
    }
  }
}