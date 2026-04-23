const DEFAULT_STOCK = 10;

const inventoryData = [
  { name: "Larve", costPerItem: 3.25, quantity: DEFAULT_STOCK },
  { name: "Chips and Guac", costPerItem: 2.10, quantity: DEFAULT_STOCK },
  { name: "ChipsNKamiqueo", costPerItem: 1.80, quantity: DEFAULT_STOCK },
  { name: "Chips n PicaVerga", costPerItem: 1.65, quantity: DEFAULT_STOCK },
  { name: "Tacos Autheticos", costPerItem: 3.80, quantity: DEFAULT_STOCK },
  { name: "The Big Burrito", costPerItem: 5.15, quantity: DEFAULT_STOCK },
  { name: "Crispy Tostadas", costPerItem: 3.55, quantity: DEFAULT_STOCK },
  { name: "Torta Flamasos", costPerItem: 4.60, quantity: DEFAULT_STOCK },
  { name: "Enchisgano", costPerItem: 4.10, quantity: DEFAULT_STOCK },
  { name: "Platters (Platillos)", costPerItem: 4.95, quantity: DEFAULT_STOCK },
  { name: "Horchata", costPerItem: 0.95, quantity: DEFAULT_STOCK },
  { name: "Jamaica", costPerItem: 0.85, quantity: DEFAULT_STOCK },
  { name: "Artisan Churros", costPerItem: 2.70, quantity: DEFAULT_STOCK },
  { name: "Churro Bites", costPerItem: 1.90, quantity: DEFAULT_STOCK }
];

const availableItemsEl = document.getElementById("available-items");
const restockListEl = document.getElementById("restock-list");
const restockAllBtn = document.getElementById("restock-all-btn");

function formatMoney(value) {
  return value.toFixed(2);
}

function getStockClass(quantity) {
  if (quantity === 0) return "stock-out";
  if (quantity <= 3) return "stock-low";
  return "stock-good";
}

function getStockLabel(quantity) {
  if (quantity === 0) return "Out of stock";
  if (quantity <= 3) return "Low stock";
  return "In stock";
}

function renderAvailableItems() {
  availableItemsEl.innerHTML = inventoryData
    .map((item, index) => {
      const stockClass = getStockClass(item.quantity);
      const stockLabel = getStockLabel(item.quantity);

      return `
        <article class="item-card">
          <h3>${item.name}</h3>
          <div class="item-info">
            <div><strong>Status:</strong> <span class="${stockClass}">${stockLabel}</span></div>
            <div><strong>Quantity Remaining:</strong> ${item.quantity}</div>
            <div><strong>Cost per Item:</strong> $${formatMoney(item.costPerItem)}</div>
            <div><strong>Max Stock:</strong> ${DEFAULT_STOCK}</div>
          </div>

          <div class="item-actions">
            <button
              class="item-btn ${item.quantity === 0 ? "disabled-btn" : "buy-btn"}"
              data-buy-index="${index}"
              ${item.quantity === 0 ? "disabled" : ""}
            >
              Buy 1
            </button>

            ${
              item.quantity === 0
                ? `<button class="item-btn restock-btn" data-restock-index="${index}">
                     Restock This Item
                   </button>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  attachItemEvents();
}

function renderRestockList() {
  const restockItems = inventoryData.filter((item) => item.quantity === 0);

  if (restockItems.length === 0) {
    restockListEl.innerHTML = "<li>No items need restocking.</li>";
    return;
  }

  restockListEl.innerHTML = restockItems
    .map((item) => {
      const realIndex = inventoryData.findIndex((invItem) => invItem.name === item.name);

      return `
        <li>
          ${item.name} (${DEFAULT_STOCK} items to buy, $${formatMoney(item.costPerItem)}/1 item)
          <button class="item-btn restock-btn" data-restock-index="${realIndex}" style="margin-left: 10px;">
            Restock This Item
          </button>
        </li>
      `;
    })
    .join("");
}

function renderInventory() {
  renderAvailableItems();
  renderRestockList();
}

function attachItemEvents() {
  const buyButtons = document.querySelectorAll("[data-buy-index]");
  const restockButtons = document.querySelectorAll("[data-restock-index]");

  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.buyIndex);
      const item = inventoryData[index];

      if (item.quantity > 0) {
        item.quantity -= 1;
        renderInventory();
      }
    });
  });

  restockButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.restockIndex);
      inventoryData[index].quantity = DEFAULT_STOCK;
      renderInventory();
    });
  });
}

restockAllBtn.addEventListener("click", () => {
  inventoryData.forEach((item) => {
    item.quantity = DEFAULT_STOCK;
  });
  renderInventory();
});

renderInventory();