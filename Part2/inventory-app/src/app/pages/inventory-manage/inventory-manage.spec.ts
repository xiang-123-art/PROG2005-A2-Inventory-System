import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManage } from './inventory-manage';

describe('InventoryManage', () => {
  let component: InventoryManage;
  let fixture: ComponentFixture<InventoryManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryManage],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
