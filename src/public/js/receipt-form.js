document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('receiptItemsBody');
  const addRowBtn = document.getElementById('addRowBtn');
  const totalAmountEl = document.getElementById('totalAmountDisplay');
  const receiptForm = document.getElementById('createReceiptForm');

  if (!tableBody) return;

  // Re-calculate row total and overall receipt total
  function updateTotals() {
    let total = 0;
    const rows = tableBody.querySelectorAll('tr.item-row');

    rows.forEach((row, index) => {
      // Update STT (Column A)
      const sttCell = row.querySelector('.row-stt');
      if (sttCell) sttCell.textContent = index + 1;

      const actualQtyInput = row.querySelector('.actual-qty-input');
      const unitPriceInput = row.querySelector('.unit-price-input');
      const amountInput = row.querySelector('.amount-input');

      const qty = parseFloat(actualQtyInput?.value || 0);
      const price = parseFloat(unitPriceInput?.value || 0);
      const rowAmount = qty * price;

      if (amountInput) {
        amountInput.value = new Intl.NumberFormat('vi-VN').format(rowAmount);
        amountInput.dataset.value = rowAmount;
      }

      total += rowAmount;
    });

    if (totalAmountEl) {
      totalAmountEl.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
    }
  }

  // Handle Item selection change to fill Unit and pre-fill item info
  function handleItemChange(event) {
    const select = event.target;
    const selectedOption = select.options[select.selectedIndex];
    const row = select.closest('tr');

    if (!row || !selectedOption) return;

    const unitId = selectedOption.dataset.unitId;
    const unitSelect = row.querySelector('.unit-select');
    const specInput = row.querySelector('.specifications-input');

    if (unitSelect && unitId) {
      unitSelect.value = unitId;
    }
    if (specInput) {
      specInput.value = selectedOption.dataset.spec || '';
    }
  }

  // Add new item row to the table
  function addNewRow() {
    const rowCount = tableBody.querySelectorAll('tr.item-row').length + 1;
    const templateRow = tableBody.querySelector('tr.item-row');

    if (!templateRow) return;

    const newRow = templateRow.cloneNode(true);
    
    // Reset values in new row
    newRow.querySelectorAll('input').forEach(input => {
      if (input.classList.contains('doc-qty-input') || input.classList.contains('actual-qty-input')) {
        input.value = '1';
      } else if (input.classList.contains('unit-price-input')) {
        input.value = '0';
      } else if (input.classList.contains('amount-input')) {
        input.value = '0';
        input.dataset.value = '0';
      } else {
        input.value = '';
      }
    });

    newRow.querySelectorAll('select').forEach(select => {
      select.selectedIndex = 0;
    });

    // Attach listeners
    attachRowListeners(newRow);

    tableBody.appendChild(newRow);
    updateTotals();
  }

  // Attach event listeners to row inputs
  function attachRowListeners(row) {
    const itemSelect = row.querySelector('.item-select');
    if (itemSelect) {
      itemSelect.addEventListener('change', handleItemChange);
    }

    const docQtyInput = row.querySelector('.doc-qty-input');
    const actualQtyInput = row.querySelector('.actual-qty-input');
    const unitPriceInput = row.querySelector('.unit-price-input');
    const deleteBtn = row.querySelector('.remove-row-btn');

    [docQtyInput, actualQtyInput, unitPriceInput].forEach(input => {
      if (input) {
        input.addEventListener('input', updateTotals);
      }
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const rows = tableBody.querySelectorAll('tr.item-row');
        if (rows.length <= 1) {
          alert('Phiếu nhập kho phải có ít nhất 1 dòng chi tiết vật tư!');
          return;
        }
        row.remove();
        updateTotals();
      });
    }
  }

  // Auto-select Keeper and Creator based on selected Warehouse
  const mainWarehouseSelect = document.getElementById('warehouse_id');
  const keeperSelect = document.getElementById('keeper_id');
  const creatorSelect = document.getElementById('created_by_id');

  if (mainWarehouseSelect && keeperSelect) {
    mainWarehouseSelect.addEventListener('change', () => {
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
  tableBody.querySelectorAll('tr.item-row').forEach(attachRowListeners);
  if (addRowBtn) {
    addRowBtn.addEventListener('click', addNewRow);
  }

  // Handle Form Submission
  if (receiptForm) {
    receiptForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const receiptNo = document.getElementById('receipt_no')?.value.trim();
      const receiptDate = document.getElementById('receipt_date')?.value;
      const originalDocumentNo = document.getElementById('original_document_no')?.value.trim();
      const originalDocumentDate = document.getElementById('original_document_date')?.value;
      const delivererName = document.getElementById('deliverer_name')?.value.trim();
      const supplierId = document.getElementById('supplier_id')?.value;
      const warehouseId = document.getElementById('warehouse_id')?.value;
      const debitAccount = document.getElementById('debit_account')?.value.trim();
      const creditAccount = document.getElementById('credit_account')?.value.trim();
      const createdById = document.getElementById('created_by_id')?.value;
      const keeperId = document.getElementById('keeper_id')?.value;
      const accountantId = document.getElementById('accountant_id')?.value;

      const rows = tableBody.querySelectorAll('tr.item-row');
      const details = [];

      let hasValidItem = true;
      rows.forEach((row, idx) => {
        const itemId = row.querySelector('.item-select')?.value;
        const unitId = row.querySelector('.unit-select')?.value;
        const rowWarehouseId = row.querySelector('.row-warehouse-select')?.value || warehouseId;
        const docQty = parseFloat(row.querySelector('.doc-qty-input')?.value || 0);
        const actualQty = parseFloat(row.querySelector('.actual-qty-input')?.value || 0);
        const unitPrice = parseFloat(row.querySelector('.unit-price-input')?.value || 0);

        if (!itemId || !unitId) {
          alert(`Dòng ${idx + 1}: Vui lòng chọn vật tư và đơn vị tính!`);
          hasValidItem = false;
          return;
        }

        details.push({
          item_id: itemId,
          unit_id: unitId,
          warehouse_id: rowWarehouseId,
          document_quantity: docQty,
          actual_quantity: actualQty,
          unit_price: unitPrice
        });
      });

      if (!hasValidItem) return;

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
        created_by_id: createdById,
        keeper_id: keeperId,
        accountant_id: accountantId,
        details,
      };

      try {
        const response = await fetch('/receipts/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.success) {
          alert('🎉 Tạo phiếu nhập kho thành công!');
          window.location.href = `/receipts/${result.data.id}`;
        } else {
          alert(`❌ Lỗi: ${result.message}`);
        }
      } catch (err) {
        console.error(err);
        alert('❌ Có lỗi kết nối server!');
      }
    });
  }

  // Initial calculation on page load
  updateTotals();
});
