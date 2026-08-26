document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("receiptItemsBody");
  const addRowBtn = document.getElementById("addRowBtn");
  const totalAmountEl = document.getElementById("totalAmountDisplay");
  const receiptForm = document.getElementById("createReceiptForm");

  if (!tableBody) return;

  // Render notification banner (matching module UI design)
  function showNotification(type, message) {
    const banner = document.getElementById("notificationBanner");
    if (!banner) {
      alert(message);
      return;
    }

    if (type === "error") {
      banner.className =
        "p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center justify-between shadow-sm mb-6 transition-all animate-fade-in";
      banner.innerHTML = `
        <div class="flex items-center">
          <i class="fa-solid fa-triangle-exclamation text-rose-500 mr-3 text-lg"></i>
          <span>${message}</span>
        </div>
        <button type="button" onclick="this.parentElement.classList.add('hidden')" class="text-rose-500 hover:text-rose-700 p-1">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
    } else {
      banner.className =
        "p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-sm mb-6 transition-all animate-fade-in";
      banner.innerHTML = `
        <div class="flex items-center">
          <i class="fa-solid fa-circle-check text-emerald-500 mr-3 text-lg"></i>
          <span>${message}</span>
        </div>
        <button type="button" onclick="this.parentElement.classList.add('hidden')" class="text-emerald-500 hover:text-emerald-700 p-1">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
    }

    banner.classList.remove("hidden");
    banner.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Re-calculate row total and overall receipt total
  function updateTotals() {
    let total = 0;
    const rows = tableBody.querySelectorAll("tr.item-row");

    rows.forEach((row, index) => {
      // Update STT (Column A)
      const sttCell = row.querySelector(".row-stt");
      if (sttCell) sttCell.textContent = index + 1;

      const actualQtyInput = row.querySelector(".actual-qty-input");
      const unitPriceInput = row.querySelector(".unit-price-input");
      const amountInput = row.querySelector(".amount-input");

      const qty = parseFloat(actualQtyInput?.value || 0);
      const price = parseFloat(unitPriceInput?.value || 0);
      const rowAmount = qty * price;

      if (amountInput) {
        amountInput.value = new Intl.NumberFormat("vi-VN").format(rowAmount);
        amountInput.dataset.value = rowAmount;
      }

      total += rowAmount;
    });

    if (totalAmountEl) {
      totalAmountEl.textContent = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(total);
    }
  }

  // Update available product options across all dropdowns (hide already selected products)
  function updateProductOptions() {
    const allSelects = tableBody.querySelectorAll(".item-select");
    const selectedIds = new Set();
    allSelects.forEach((select) => {
      if (select.value) {
        selectedIds.add(select.value);
      }
    });

    allSelects.forEach((select) => {
      const currentValue = select.value;
      Array.from(select.options).forEach((option) => {
        if (!option.value) return;

        if (selectedIds.has(option.value) && option.value !== currentValue) {
          option.hidden = true;
          option.style.display = "none";
          option.disabled = true;
        } else {
          option.hidden = false;
          option.style.display = "";
          option.disabled = false;
        }
      });
    });
  }

  // Handle Item selection change to fill Unit and pre-fill item info
  function handleItemChange(event) {
    const select = event.target;
    const selectedOption = select.options[select.selectedIndex];
    const row = select.closest("tr");

    if (!row || !selectedOption) return;

    const unitId = selectedOption.dataset.unitId;
    const unitSelect = row.querySelector(".unit-select");
    const specInput = row.querySelector(".specifications-input");

    if (unitSelect && unitId) {
      unitSelect.value = unitId;
    }
    if (specInput) {
      specInput.value = selectedOption.dataset.spec || "";
    }

    updateProductOptions();
  }

  // Add new item row to the table
  function addNewRow() {
    const rowCount = tableBody.querySelectorAll("tr.item-row").length + 1;
    const templateRow = tableBody.querySelector("tr.item-row");

    if (!templateRow) return;

    const newRow = templateRow.cloneNode(true);

    // Reset values in new row
    newRow.querySelectorAll("input").forEach((input) => {
      if (
        input.classList.contains("doc-qty-input") ||
        input.classList.contains("actual-qty-input")
      ) {
        input.value = "1";
      } else if (input.classList.contains("unit-price-input")) {
        input.value = "0";
      } else if (input.classList.contains("amount-input")) {
        input.value = "0";
        input.dataset.value = "0";
      } else {
        input.value = "";
      }
    });

    newRow.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0;
    });

    // Attach listeners
    attachRowListeners(newRow);

    tableBody.appendChild(newRow);
    updateTotals();
    updateProductOptions();
  }

  // Attach event listeners to row inputs
  function attachRowListeners(row) {
    const itemSelect = row.querySelector(".item-select");
    if (itemSelect) {
      itemSelect.addEventListener("change", handleItemChange);
    }

    const docQtyInput = row.querySelector(".doc-qty-input");
    const actualQtyInput = row.querySelector(".actual-qty-input");
    const unitPriceInput = row.querySelector(".unit-price-input");
    const deleteBtn = row.querySelector(".remove-row-btn");

    [docQtyInput, actualQtyInput, unitPriceInput].forEach((input) => {
      if (input) {
        input.addEventListener("input", updateTotals);
      }
    });

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const rows = tableBody.querySelectorAll("tr.item-row");
        if (rows.length <= 1) {
          showNotification(
            "error",
            "Phiếu nhập kho phải có ít nhất 1 dòng chi tiết vật tư!",
          );
          return;
        }
        row.remove();
        updateTotals();
        updateProductOptions();
      });
    }
  }

  // Auto-select Keeper and Creator based on selected Warehouse
  const mainWarehouseSelect = document.getElementById("warehouse_id");
  const keeperSelect = document.getElementById("keeper_id");
  const creatorSelect = document.getElementById("created_by_id");

  if (mainWarehouseSelect && keeperSelect) {
    mainWarehouseSelect.addEventListener("change", () => {
      const selectedWh = mainWarehouseSelect.value;
      if (!selectedWh) return;

      // Automatically select matching keeper for selected warehouse if available
      for (let i = 0; i < keeperSelect.options.length; i++) {
        const opt = keeperSelect.options[i];
        if (opt.dataset.warehouseId === selectedWh) {
          keeperSelect.selectedIndex = i;
          break;
        }
      }

      // Automatically select matching creator for selected warehouse if available
      if (creatorSelect) {
        for (let i = 0; i < creatorSelect.options.length; i++) {
          const opt = creatorSelect.options[i];
          if (opt.dataset.warehouseId === selectedWh) {
            creatorSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  }

  // Init existing rows
  tableBody.querySelectorAll("tr.item-row").forEach(attachRowListeners);
  if (addRowBtn) {
    addRowBtn.addEventListener("click", addNewRow);
  }

  // Handle status submit button clicks
  document.querySelectorAll(".btn-status-submit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const statusVal = btn.getAttribute("data-status");
      const statusInput = document.getElementById("status");
      if (statusInput && statusVal) {
        statusInput.value = statusVal;
      }
    });
  });

  // Handle status action dropdown toggle & selection
  const toggleDropdownBtn = document.getElementById("toggleStatusDropdown");
  const dropdownMenu = document.getElementById("statusDropdownMenu");
  const mainSubmitBtn = document.getElementById("mainSubmitBtn");
  const mainSubmitLabel = document.getElementById("mainSubmitLabel");
  const mainSubmitIcon = document.getElementById("mainSubmitIcon");

  if (toggleDropdownBtn && dropdownMenu) {
    toggleDropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== toggleDropdownBtn) {
        dropdownMenu.classList.add("hidden");
      }
    });

    document.querySelectorAll(".dropdown-status-option").forEach((optBtn) => {
      optBtn.addEventListener("click", () => {
        const selectedStatus = optBtn.getAttribute("data-status");
        const statusInput = document.getElementById("status");
        if (statusInput && selectedStatus) {
          statusInput.value = selectedStatus;
        }

        if (selectedStatus === "DRAFT") {
          if (mainSubmitBtn) {
            mainSubmitBtn.setAttribute("data-status", "DRAFT");
            mainSubmitBtn.className =
              "btn-status-submit px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all flex items-center";
          }
          if (toggleDropdownBtn) {
            toggleDropdownBtn.className =
              "px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm border-l border-amber-400/40 transition-all";
          }
          if (mainSubmitLabel) mainSubmitLabel.textContent = "Lưu Nháp (Draft)";
          if (mainSubmitIcon)
            mainSubmitIcon.className = "fa-solid fa-pen-to-square mr-1.5";
        } else if (selectedStatus === "CANCEL") {
          if (mainSubmitBtn) {
            mainSubmitBtn.setAttribute("data-status", "CANCEL");
            mainSubmitBtn.className =
              "btn-status-submit px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-all flex items-center";
          }
          if (toggleDropdownBtn) {
            toggleDropdownBtn.className =
              "px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm border-l border-rose-500/40 transition-all";
          }
          if (mainSubmitLabel)
            mainSubmitLabel.textContent = "Hủy Phiếu (Cancel)";
          if (mainSubmitIcon)
            mainSubmitIcon.className = "fa-solid fa-ban mr-1.5";
        } else {
          if (mainSubmitBtn) {
            mainSubmitBtn.setAttribute("data-status", "PUBLIC");
            mainSubmitBtn.className =
              "btn-status-submit px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all flex items-center";
          }
          if (toggleDropdownBtn) {
            toggleDropdownBtn.className =
              "px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm border-l border-emerald-500/40 transition-all";
          }
          if (mainSubmitLabel)
            mainSubmitLabel.textContent = "Phát Hành (Public)";
          if (mainSubmitIcon)
            mainSubmitIcon.className = "fa-solid fa-paper-plane mr-1.5";
        }

        dropdownMenu.classList.add("hidden");
        if (receiptForm) {
          receiptForm.requestSubmit();
        }
      });
    });
  }

  // Handle Form Submission
  if (receiptForm) {
    receiptForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const receiptNo = document.getElementById("receipt_no")?.value.trim();
      const receiptDate = document.getElementById("receipt_date")?.value;
      const originalDocumentNo = document
        .getElementById("original_document_no")
        ?.value.trim();
      const originalDocumentDate = document.getElementById(
        "original_document_date",
      )?.value;
      const delivererName = document
        .getElementById("deliverer_name")
        ?.value.trim();
      const supplierId = document.getElementById("supplier_id")?.value;
      const warehouseId = document.getElementById("warehouse_id")?.value;
      const debitAccount = document
        .getElementById("debit_account")
        ?.value.trim();
      const creditAccount = document
        .getElementById("credit_account")
        ?.value.trim();
      const createdById = document.getElementById("created_by_id")?.value;
      const keeperId = document.getElementById("keeper_id")?.value;
      const accountantId = document.getElementById("accountant_id")?.value;

      const rows = tableBody.querySelectorAll("tr.item-row");
      const details = [];

      rows.forEach((row) => {
        const itemId = row.querySelector(".item-select")?.value;
        const unitId = row.querySelector(".unit-select")?.value;
        const rowWarehouseId =
          row.querySelector(".row-warehouse-select")?.value || warehouseId;
        const docQty = parseFloat(
          row.querySelector(".doc-qty-input")?.value || 0,
        );
        const actualQty = parseFloat(
          row.querySelector(".actual-qty-input")?.value || 0,
        );
        const unitPrice = parseFloat(
          row.querySelector(".unit-price-input")?.value || 0,
        );

        if (itemId || unitId) {
          details.push({
            item_id: itemId,
            unit_id: unitId,
            warehouse_id: rowWarehouseId,
            document_quantity: docQty,
            actual_quantity: actualQty,
            unit_price: unitPrice,
          });
        }
      });

      const selectedItemIds = details.map((d) => d.item_id).filter(Boolean);
      if (new Set(selectedItemIds).size !== selectedItemIds.length) {
        showNotification(
          "error",
          "Vui lòng không chọn trùng lặp vật tư / hàng hóa trong cùng một phiếu nhập!",
        );
        return;
      }

      const payload = {
        receipt_no: receiptNo,
        receipt_date: receiptDate,
        original_document_no: originalDocumentNo,
        original_document_date: originalDocumentDate,
        deliverer_name: delivererName,
        supplier_id: supplierId,
        warehouse_id: warehouseId,
        debit_account: debitAccount,
        credit_account: creditAccount,
        status: document.getElementById("status")?.value || "DRAFT",
        created_by_id: createdById,
        keeper_id: keeperId,
        accountant_id: accountantId,
        details,
      };

      try {
        const receiptId = receiptForm.dataset.receiptId;
        const submitUrl = receiptId ? `/receipts/${receiptId}/edit` : "/receipts/create";
        const response = await fetch(submitUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          showNotification("success", receiptId ? "Cập nhật phiếu nhập kho thành công!" : "Tạo phiếu nhập kho thành công!");
          setTimeout(() => {
            window.location.href = `/receipts/${result.data.id}`;
          }, 800);
        } else {
          showNotification(
            "error",
            result.message || "Lưu phiếu không thành công.",
          );
        }
      } catch (err) {
        console.error(err);
        showNotification("error", "Có lỗi kết nối máy chủ! Vui lòng thử lại.");
      }
    });
  }

  // Initial calculation on page load
  updateTotals();
  updateProductOptions();
});
