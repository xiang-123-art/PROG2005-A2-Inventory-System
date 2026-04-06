/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 1
 * TypeScript Inventory Management System
 */

// 1. 定义枚举类型（固定选项，避免输入错误）
export enum Category {
  Electronics = "Electronics",
  Furniture = "Furniture",
  Clothing = "Clothing",
  Tools = "Tools",
  Miscellaneous = "Miscellaneous"
}

export enum StockStatus {
  InStock = "In Stock",
  LowStock = "Low Stock",
  OutOfStock = "Out of Stock"
}

export enum PopularStatus {
  Yes = "Yes",
  No = "No"
}

// 2. 定义Item核心接口（作业要求的所有字段，必填项严格校验）
export interface InventoryItem {
  itemId: string; // 唯一ID，不可重复
  itemName: string;
  category: Category;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  popularItem: PopularStatus;
  comment?: string; // 唯一可选字段
}

// 3. 初始化库存数组（会话内存储，浏览器开着数据就存在）
let inventoryList: InventoryItem[] = [
  // 硬编码初始数据，符合作业要求，也可以留空
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

// 4. 工具函数：根据数量自动更新库存状态（避免手动输入错误）
function updateStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return StockStatus.OutOfStock;
  if (quantity <= 10) return StockStatus.LowStock;
  return StockStatus.InStock;
}

// 5. 工具函数：页面渲染（把数据显示到页面上，替代alert，符合作业要求）
function renderMessage(message: string, isError: boolean = false) {
  const messageElement = document.getElementById("message-box")!;
  messageElement.innerHTML = message;
  messageElement.style.color = isError ? "#dc2626" : "#059669";
  // 3秒后自动清空消息
  setTimeout(() => { messageElement.innerHTML = ""; }, 3000);
}
// ===================== 核心功能实现（完全匹配作业要求）=====================

/**
 * 1. 添加商品功能
 * 作业要求：Item ID唯一、必填字段校验、数据验证
 */
function addItem(): void {
  // 获取表单输入值
  const itemId = (document.getElementById("item-id") as HTMLInputElement).value.trim();
  const itemName = (document.getElementById("item-name") as HTMLInputElement).value.trim();
  const category = (document.getElementById("category") as HTMLSelectElement).value as Category;
  const quantity = Number((document.getElementById("quantity") as HTMLInputElement).value.trim());
  const price = Number((document.getElementById("price") as HTMLInputElement).value.trim());
  const supplierName = (document.getElementById("supplier-name") as HTMLInputElement).value.trim();
  const popularItem = (document.getElementById("popular-item") as HTMLSelectElement).value as PopularStatus;
  const comment = (document.getElementById("comment") as HTMLInputElement).value.trim();

  // 数据校验1：必填项不能为空
  if (!itemId || !itemName || !category || isNaN(quantity) || isNaN(price) || !supplierName || !popularItem) {
    renderMessage("错误：除备注外，所有字段必须填写！", true);
    return;
  }

  // 数据校验2：Item ID必须唯一
  if (inventoryList.some(item => item.itemId === itemId)) {
    renderMessage("错误：Item ID已存在，必须唯一！", true);
    return;
  }

  // 数据校验3：数量和价格必须大于0
  if (quantity < 0 || price <= 0) {
    renderMessage("错误：数量不能为负数，价格必须大于0！", true);
    return;
  }

  // 创建新商品
  const newItem: InventoryItem = {
    itemId,
    itemName,
    category: category as Category,
    quantity,
    price,
    supplierName,
    stockStatus: updateStockStatus(quantity),
    popularItem: popularItem as PopularStatus,
    comment: comment || undefined
  };

  // 添加到库存数组
  inventoryList.push(newItem);
  renderMessage("✅ 商品添加成功！");
  // 清空表单
  clearForm();
  // 重新渲染列表
  renderAllItems();
}

/**
 * 2. 按商品名称更新/编辑商品（作业要求：用item name执行更新）
 */
function updateItem(): void {
  const itemName = (document.getElementById("search-name") as HTMLInputElement).value.trim();
  if (!itemName) {
    renderMessage("错误：请输入要编辑的商品名称！", true);
    return;
  }

  // 查找商品
  const itemIndex = inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.toLowerCase());
  if (itemIndex === -1) {
    renderMessage("错误：未找到该商品！", true);
    return;
  }

  // 获取新的输入值
  const newQuantity = Number((document.getElementById("update-quantity") as HTMLInputElement).value.trim());
  const newPrice = Number((document.getElementById("update-price") as HTMLInputElement).value.trim());
  const newSupplier = (document.getElementById("update-supplier") as HTMLInputElement).value.trim();
  const newPopular = (document.getElementById("update-popular") as HTMLSelectElement).value as PopularStatus;
  const newComment = (document.getElementById("update-comment") as HTMLInputElement).value.trim();

  // 数据校验
  if (isNaN(newQuantity) || isNaN(newPrice) || !newSupplier || !newPopular) {
    renderMessage("错误：所有编辑字段必须填写有效内容！", true);
    return;
  }
  if (newQuantity < 0 || newPrice <= 0) {
    renderMessage("错误：数量不能为负数，价格必须大于0！", true);
    return;
  }

  // 更新商品信息
  inventoryList[itemIndex].quantity = newQuantity;
  inventoryList[itemIndex].price = newPrice;
  inventoryList[itemIndex].supplierName = newSupplier;
  inventoryList[itemIndex].popularItem = newPopular;
  inventoryList[itemIndex].comment = newComment || undefined;
  inventoryList[itemIndex].stockStatus = updateStockStatus(newQuantity);

  renderMessage("✅ 商品信息更新成功！");
  clearUpdateForm();
  renderAllItems();
}

/**
 * 3. 按商品名称删除商品（作业要求：带确认提示，用item name删除）
 */
function deleteItem(): void {
  const itemName = (document.getElementById("delete-name") as HTMLInputElement).value.trim();
  if (!itemName) {
    renderMessage("错误：请输入要删除的商品名称！", true);
    return;
  }

  // 查找商品
  const itemIndex = inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.toLowerCase());
  if (itemIndex === -1) {
    renderMessage("错误：未找到该商品！", true);
    return;
  }

  // 确认删除提示（作业要求）
  const isConfirm = confirm(`确定要删除商品「${itemName}」吗？此操作不可撤销！`);
  if (!isConfirm) return;

  // 执行删除
  inventoryList.splice(itemIndex, 1);
  renderMessage("✅ 商品删除成功！");
  (document.getElementById("delete-name") as HTMLInputElement).value = "";
  renderAllItems();
}

/**
 * 4. 按商品名称搜索功能（作业要求）
 */
function searchItem(): void {
  const searchKeyword = (document.getElementById("search-input") as HTMLInputElement).value.trim().toLowerCase();
  if (!searchKeyword) {
    renderMessage("请输入搜索关键词！", true);
    return;
  }

  // 模糊搜索商品名称
  const searchResult = inventoryList.filter(item => item.itemName.toLowerCase().includes(searchKeyword));
  const tableBody = document.getElementById("item-table-body")!;

  if (searchResult.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 1rem;">未找到匹配的商品</td></tr>`;
    renderMessage("未找到匹配的商品", true);
    return;
  }

  // 渲染搜索结果
  renderItemList(searchResult);
  renderMessage(`✅ 找到${searchResult.length}个匹配商品`);
}

/**
 * 5. 渲染所有商品（作业要求）
 */
function renderAllItems(): void {
  renderItemList(inventoryList);
}

/**
 * 6. 渲染所有热门商品（作业要求）
 */
function renderPopularItems(): void {
  const popularItems = inventoryList.filter(item => item.popularItem === PopularStatus.Yes);
  if (popularItems.length === 0) {
    renderMessage("暂无热门商品", true);
    renderItemList([]);
    return;
  }
  renderItemList(popularItems);
  renderMessage(`✅ 已筛选出${popularItems.length}个热门商品`);
}

// ===================== 辅助工具函数 =====================
// 渲染商品列表到表格
function renderItemList(items: InventoryItem[]): void {
  const tableBody = document.getElementById("item-table-body")!;
  if (items.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 1rem;">暂无商品数据</td></tr>`;
    return;
  }

  tableBody.innerHTML = items.map(item => `
    <tr>
      <td>${item.itemId}</td>
      <td>${item.itemName}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.supplierName}</td>
      <td>${item.stockStatus}</td>
      <td>${item.popularItem}</td>
      <td>${item.comment || "-"}</td>
    </tr>
  `).join("");
}

// 清空添加表单
function clearForm(): void {
  (document.getElementById("item-id") as HTMLInputElement).value = "";
  (document.getElementById("item-name") as HTMLInputElement).value = "";
  (document.getElementById("category") as HTMLSelectElement).value = "";
  (document.getElementById("quantity") as HTMLInputElement).value = "";
  (document.getElementById("price") as HTMLInputElement).value = "";
  (document.getElementById("supplier-name") as HTMLInputElement).value = "";
  (document.getElementById("popular-item") as HTMLSelectElement).value = "";
  (document.getElementById("comment") as HTMLInputElement).value = "";
}

// 清空编辑表单
function clearUpdateForm(): void {
  (document.getElementById("search-name") as HTMLInputElement).value = "";
  (document.getElementById("update-quantity") as HTMLInputElement).value = "";
  (document.getElementById("update-price") as HTMLInputElement).value = "";
  (document.getElementById("update-supplier") as HTMLInputElement).value = "";
  (document.getElementById("update-popular") as HTMLSelectElement).value = "";
  (document.getElementById("update-comment") as HTMLInputElement).value = "";
}

// ===================== 页面加载后绑定事件 =====================
// 页面DOM加载完成后，绑定所有按钮的点击事件
document.addEventListener("DOMContentLoaded", () => {
  // 绑定按钮事件
  document.getElementById("add-btn")!.addEventListener("click", addItem);
  document.getElementById("update-btn")!.addEventListener("click", updateItem);
  document.getElementById("delete-btn")!.addEventListener("click", deleteItem);
  document.getElementById("search-btn")!.addEventListener("click", searchItem);
  document.getElementById("show-all-btn")!.addEventListener("click", renderAllItems);
  document.getElementById("show-popular-btn")!.addEventListener("click", renderPopularItems);
  document.getElementById("clear-form-btn")!.addEventListener("click", clearForm);

  // 页面加载时渲染初始数据
  renderAllItems();
});