/*
 * Author: XiangHu
 * Student ID: 24832203
 * PROG2005 Assessment 2 Part 1
 * TypeScript Inventory Management System
 */
// 1. Define enum types (fixed options to avoid input errors)
export var Category;
(function (Category) {
    Category["Electronics"] = "Electronics";
    Category["Furniture"] = "Furniture";
    Category["Clothing"] = "Clothing";

    Category["Tools"] = "Tools";
    Category["Miscellaneous"] = "Miscellaneous";
})(Category || (Category = {}));

export var StockStatus;
(function (StockStatus) {
    StockStatus["InStock"] = "In Stock";
    StockStatus["LowStock"] = "Low Stock";
    StockStatus["OutOfStock"] = "Out of Stock";

})(StockStatus || (StockStatus = {}));
export var PopularStatus;
(function (PopularStatus) {
    PopularStatus["Yes"] = "Yes";

    PopularStatus["No"] = "No";
})(PopularStatus || (PopularStatus = {}));
// 3. Initialize inventory array
let inventoryList = [
    
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
// 4. Utility function: Auto-update stock status based on quantity
function updateStockStatus(quantity) {
    if (quantity <= 0)
        return StockStatus.OutOfStock;
    if (quantity <= 10)
        return StockStatus.LowStock;
    return StockStatus.InStock;
}
// 5. Utility function: Page rendering
function renderMessage(message, isError = false) {
    const messageElement = document.getElementById("message-box");

    messageElement.innerHTML = message;

    messageElement.style.color = isError ? "#dc2626" : "#059669";
    // Auto-clear message after 3 seconds
    setTimeout(() => { messageElement.innerHTML = ""; }, 3000);
}
// ===================== Core Feature Implementation =====================
/**
 * 1. Add item feature
 * Assignment requirements: Unique Item ID, required field validation, data validation
 */
function addItem() {
    // Get form input values
    const itemId = document.getElementById("item-id").value.trim();
    const itemName = document.getElementById("item-name").value.trim();
    const category = document.getElementById("category").value;
    const quantity = Number(document.getElementById("quantity").value.trim());
    const price = Number(document.getElementById("price").value.trim());
    const supplierName = document.getElementById("supplier-name").value.trim();
    const popularItem = document.getElementById("popular-item").value;
    const comment = document.getElementById("comment").value.trim();
    // Validation 1: Required fields cannot be empty
    if (!itemId || !itemName || !category || isNaN(quantity) || isNaN(price) || !supplierName || !popularItem) {
        renderMessage("Error: All fields except comment are required!", true);
        return;
    }
    // Validation 2: Item ID must be unique
    if (inventoryList.some(item => item.itemId === itemId)) {
        renderMessage("Error: Item ID already exists, must be unique!", true);
        return;
    }
    // Validation 3: Quantity and price must be greater than 0
    if (quantity < 0 || price <= 0) {
        renderMessage("Error: Quantity cannot be negative, price must be greater than 0!", true);
        return;
    }
    // Create new item
    const newItem = {
        itemId,
        itemName,
        category: category,
        quantity,
        price,
        supplierName,
        stockStatus: updateStockStatus(quantity),
        popularItem: popularItem,
        comment: comment || undefined
    };
    // Add to inventory array
    inventoryList.push(newItem);
    renderMessage("✅ Item added successfully!");
    // Clear form
    clearForm();
    // Re-render list
    renderAllItems();
}
/**
 * 2. Update/edit item by item name
 */
function updateItem() {
    const itemName = document.getElementById("search-name").value.trim();
    if (!itemName) {
        renderMessage("Error: Please enter the item name to edit!", true);
        return;
    }
    // Find item
    const itemIndex = inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.toLowerCase());
    if (itemIndex === -1) {
        renderMessage("Error: Item not found!", true);
        return;
    }
    // Get new input values
    const newQuantity = Number(document.getElementById("update-quantity").value.trim());
    const newPrice = Number(document.getElementById("update-price").value.trim());
    const newSupplier = document.getElementById("update-supplier").value.trim();
    const newPopular = document.getElementById("update-popular").value;
    const newComment = document.getElementById("update-comment").value.trim();
    // Data validation
    if (isNaN(newQuantity) || isNaN(newPrice) || !newSupplier || !newPopular) {
        renderMessage("Error: All edit fields must contain valid content!", true);
        return;
    }
    if (newQuantity < 0 || newPrice <= 0) {
        renderMessage("Error: Quantity cannot be negative, price must be greater than 0!", true);
        return;
    }
    // Update item information
    inventoryList[itemIndex].quantity = newQuantity;
    inventoryList[itemIndex].price = newPrice;
    inventoryList[itemIndex].supplierName = newSupplier;
    inventoryList[itemIndex].popularItem = newPopular;
    inventoryList[itemIndex].comment = newComment || undefined;
    inventoryList[itemIndex].stockStatus = updateStockStatus(newQuantity);
    renderMessage("✅ Item updated successfully!");
    clearUpdateForm();
    renderAllItems();
}
/**
 * 3. Delete item by item name
 */
function deleteItem() {
    const itemName = document.getElementById("delete-name").value.trim();
    if (!itemName) {
        renderMessage("Error: Please enter the item name to delete!", true);
        return;
    }
    // Find item
    const itemIndex = inventoryList.findIndex(item => item.itemName.toLowerCase() === itemName.toLowerCase());
    if (itemIndex === -1) {
        renderMessage("Error: Item not found!", true);
        return;
    }
    // Confirmation prompt
    const isConfirm = confirm(`Are you sure you want to delete item "${itemName}"? This action cannot be undone!`);
    if (!isConfirm)
        return;
    // Execute deletion
    inventoryList.splice(itemIndex, 1);
    renderMessage("✅ Item deleted successfully!");
    document.getElementById("delete-name").value = "";
    renderAllItems();
}
/**
 * 4. Search item by name feature (Assignment requirement)
 */
function searchItem() {
    const searchKeyword = document.getElementById("search-input").value.trim().toLowerCase();
    if (!searchKeyword) {
        renderMessage("Please enter a search keyword!", true);
        return;
    }
    // Fuzzy search item name
    const searchResult = inventoryList.filter(item => item.itemName.toLowerCase().includes(searchKeyword));
    const tableBody = document.getElementById("item-table-body");
    if (searchResult.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 1rem;">No matching items found</td></tr>`;
        renderMessage("No matching items found", true);
        return;
    }
    // Render search results
    renderItemList(searchResult);
    renderMessage(`✅ Found ${searchResult.length} matching item(s)`);
}
/**
 * 5. Render all items (Assignment requirement)
 */
function renderAllItems() {
    renderItemList(inventoryList);
}
/**
 * 6. Render all popular items (Assignment requirement)
 */
function renderPopularItems() {
    const popularItems = inventoryList.filter(item => item.popularItem === PopularStatus.Yes);
    if (popularItems.length === 0) {
        renderMessage("No popular items available", true);
        renderItemList([]);
        return;
    }
    renderItemList(popularItems);
    renderMessage(`✅ Filtered ${popularItems.length} popular item(s)`);
}
// ===================== Helper Utility Functions =====================
// Render item list to table
function renderItemList(items) {
    const tableBody = document.getElementById("item-table-body");
    if (items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 1rem;">No item data available</td></tr>`;
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
// Clear add form
function clearForm() {
    document.getElementById("item-id").value = "";
    document.getElementById("item-name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
    document.getElementById("supplier-name").value = "";
    document.getElementById("popular-item").value = "";
    document.getElementById("comment").value = "";
}
// Clear update form
function clearUpdateForm() {
    document.getElementById("search-name").value = "";
    document.getElementById("update-quantity").value = "";
    document.getElementById("update-price").value = "";
    document.getElementById("update-supplier").value = "";
    document.getElementById("update-popular").value = "";
    document.getElementById("update-comment").value = "";
}
// ===================== Bind Events After Page Load =====================
// After DOM loads, bind all button click events
document.addEventListener("DOMContentLoaded", () => {
    // Bind button events
    document.getElementById("add-btn").addEventListener("click", addItem);
    document.getElementById("update-btn").addEventListener("click", updateItem);
    document.getElementById("delete-btn").addEventListener("click", deleteItem);
    document.getElementById("search-btn").addEventListener("click", searchItem);
    document.getElementById("show-all-btn").addEventListener("click", renderAllItems);
    document.getElementById("show-popular-btn").addEventListener("click", renderPopularItems);
    document.getElementById("clear-form-btn").addEventListener("click", clearForm);
    // Render initial data when page loads
    renderAllItems();
});
