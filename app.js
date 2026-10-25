/**
 * ============================================================================
 * FairShare — Mobile-First, Touch-Optimized App Logic
 * ============================================================================
 */

// ============================================================================
// 1. APPLICATION STATE
// ============================================================================

const FRIEND_PALETTE = [
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
];

const state = {
  currency: '£',
  serviceRate: 12.5,
  taxAmount: 0.0,
  payerId: null, // Friend ID who paid the restaurant bill
  friends: [],
  items: [],
  receiptImage: null,
  activeStep: 1,
};

// ============================================================================
// 2. SAMPLE PRESET
// ============================================================================

const SAMPLE_PRESET = {
  currency: '£',
  serviceRate: 12.5,
  taxAmount: 0.0,
  friends: [
    { id: 'f-1', name: 'Shabir', color: FRIEND_PALETTE[0] },
    { id: 'f-2', name: 'Sarah', color: FRIEND_PALETTE[1] },
    { id: 'f-3', name: 'Alex', color: FRIEND_PALETTE[2] },
    { id: 'f-4', name: 'Jordan', color: FRIEND_PALETTE[3] }
  ],
  payerId: 'f-1',
  items: [
    {
      id: 'item-1',
      name: 'Margherita Woodfired Pizza',
      qty: 1,
      totalPrice: 14.50,
      shares: { 'f-1': 1, 'f-2': 1 },
      isCustomShare: false
    },
    {
      id: 'item-2',
      name: 'Truffle Tagliatelle Pasta',
      qty: 1,
      totalPrice: 18.00,
      shares: { 'f-3': 1 },
      isCustomShare: false
    },
    {
      id: 'item-3',
      name: 'Ribeye Steak & Fries',
      qty: 1,
      totalPrice: 32.00,
      shares: { 'f-4': 1 },
      isCustomShare: false
    },
    {
      id: 'item-4',
      name: 'Cheesy Garlic Bread',
      qty: 1,
      totalPrice: 6.80,
      shares: { 'f-1': 1, 'f-2': 1, 'f-3': 1, 'f-4': 1 },
      isCustomShare: false
    },
    {
      id: 'item-5',
      name: 'Peroni Draught Beer',
      qty: 2,
      totalPrice: 13.00,
      shares: { 'f-1': 1, 'f-4': 1 },
      isCustomShare: false
    },
    {
      id: 'item-6',
      name: 'Sparkling Mineral Water',
      qty: 1,
      totalPrice: 4.50,
      shares: { 'f-2': 1, 'f-3': 1 },
      isCustomShare: false
    },
    {
      id: 'item-7',
      name: 'Classic Tiramisu',
      qty: 1,
      totalPrice: 7.50,
      shares: { 'f-1': 1, 'f-2': 1, 'f-3': 1 },
      isCustomShare: false
    }
  ]
};

// ============================================================================
// 3. INITIALIZATION & DOM
// ============================================================================

let dom = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOM();
  bindEvents();
  loadSampleReceipt(false);
  updateCurrencyDisplay();
  renderAll();
  updateBottomBar();
});

function initDOM() {
  dom = {
    // Stepper & Reset
    stepTabs: document.querySelectorAll('.step-tab'),
    stepSections: document.querySelectorAll('.step-section'),
    resetAppBtn: document.getElementById('resetAppBtn'),
    currencySymbol: document.getElementById('currencySymbol'),
    currSymbols: document.querySelectorAll('.curr-symbol'),

    // Step 1
    dropZone: document.getElementById('dropZone'),
    receiptFileInput: document.getElementById('receiptFileInput'),
    selectImageBtn: document.getElementById('selectImageBtn'),
    loadSampleBtn: document.getElementById('loadSampleBtn'),
    ocrProgressCard: document.getElementById('ocrProgressCard'),
    ocrStatusTitle: document.getElementById('ocrStatusTitle'),
    ocrStatusSubtitle: document.getElementById('ocrStatusSubtitle'),
    ocrProgressBar: document.getElementById('ocrProgressBar'),
    imagePreviewContainer: document.getElementById('imagePreviewContainer'),
    receiptImagePreview: document.getElementById('receiptImagePreview'),
    removeImageBtn: document.getElementById('removeImageBtn'),
    itemCountDisplay: document.getElementById('itemCountDisplay'),
    addItemBtn: document.getElementById('addItemBtn'),
    clearItemsBtn: document.getElementById('clearItemsBtn'),
    itemsListContainer: document.getElementById('itemsListContainer'),
    emptyItemsState: document.getElementById('emptyItemsState'),
    subtotalDisplay: document.getElementById('subtotalDisplay'),
    servicePresetBtns: document.querySelectorAll('.service-preset-btn'),
    serviceRateInput: document.getElementById('serviceRateInput'),
    serviceChargeDisplay: document.getElementById('serviceChargeDisplay'),
    taxAmountInput: document.getElementById('taxAmountInput'),
    grandTotalDisplay: document.getElementById('grandTotalDisplay'),
    goToStep2Btn: document.getElementById('goToStep2Btn'),

    // Step 2
    addFriendForm: document.getElementById('addFriendForm'),
    friendNameInput: document.getElementById('friendNameInput'),
    payerSelect: document.getElementById('payerSelect'),
    friendsPillsContainer: document.getElementById('friendsPillsContainer'),
    claimingCardsContainer: document.getElementById('claimingCardsContainer'),
    backToStep1Btn: document.getElementById('backToStep1Btn'),
    goToStep3Btn: document.getElementById('goToStep3Btn'),

    // Step 3
    balanceBanner: document.getElementById('balanceBanner') || document.getElementById('balanceCheckBanner'),
    balanceIcon: document.getElementById('balanceIcon'),
    balanceTitle: document.getElementById('balanceTitle'),
    balanceSubtitle: document.getElementById('balanceSubtitle'),
    assignedTotalDisplay: document.getElementById('assignedTotalDisplay'),
    summaryBillTotalDisplay: document.getElementById('summaryBillTotalDisplay'),
    payerHeroCard: document.getElementById('payerHeroCard'),
    summaryCardsGrid: document.getElementById('summaryCardsGrid'),
    startNewBillBtn: document.getElementById('startNewBillBtn'),
    copyWhatsAppBtn: document.getElementById('copyWhatsAppBtn'),
    backToStep2Btn: document.getElementById('backToStep2Btn'),
    printReceiptBtn: document.getElementById('printReceiptBtn'),

    // Mobile Bottom Thumb Bar
    mobileBottomBar: document.getElementById('mobileBottomBar'),
    bottomPrevBtn: document.getElementById('bottomPrevBtn'),
    bottomNextBtn: document.getElementById('bottomNextBtn'),
    bottomStepIndicator: document.getElementById('bottomStepIndicator'),
    bottomTotalPill: document.getElementById('bottomTotalPill'),

    // Modals & Toast
    toast: document.getElementById('toast'),
    mathModal: document.getElementById('mathModal'),
    openMathBtn: document.getElementById('openMathBtn'),
    closeMathModalBtn: document.getElementById('closeMathModalBtn'),
  };
}

// ============================================================================
// 4. EVENT LISTENERS
// ============================================================================

function bindEvents() {
  // Top stepper tabs
  dom.stepTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.dataset.step, 10);
      goToStep(step);
    });
  });

  // Desktop buttons
  if (dom.goToStep2Btn) dom.goToStep2Btn.addEventListener('click', () => goToStep(2));
  if (dom.backToStep1Btn) dom.backToStep1Btn.addEventListener('click', () => goToStep(1));
  if (dom.goToStep3Btn) dom.goToStep3Btn.addEventListener('click', () => goToStep(3));
  if (dom.backToStep2Btn) dom.backToStep2Btn.addEventListener('click', () => goToStep(2));

  // Mobile Sticky Bottom Bar Buttons
  dom.bottomPrevBtn.addEventListener('click', () => {
    if (state.activeStep > 1) {
      goToStep(state.activeStep - 1);
    }
  });

  dom.bottomNextBtn.addEventListener('click', () => {
    if (state.activeStep === 1) {
      goToStep(2);
    } else if (state.activeStep === 2) {
      goToStep(3);
    } else if (state.activeStep === 3) {
      copyWhatsAppSummary();
    }
  });

  // Clear Order / Start New Bill
  const handleClearOrder = () => {
    if (confirm('Clear this order and start a new bill? This will reset all items, friends, and calculations.')) {
      resetState();
      renderAll();
      goToStep(1);
      showToast('Order cleared! Ready for a new bill.');
    }
  };

  dom.resetAppBtn.addEventListener('click', handleClearOrder);
  if (dom.startNewBillBtn) dom.startNewBillBtn.addEventListener('click', handleClearOrder);

  // Clear Items Only (Step 1)
  if (dom.clearItemsBtn) {
    dom.clearItemsBtn.addEventListener('click', () => {
      if (state.items.length === 0) {
        showToast('No items to clear.');
        return;
      }
      if (confirm('Clear all items on this receipt?')) {
        state.items = [];
        renderItemsTable();
        updateCalculations();
        showToast('Receipt items cleared.');
      }
    });
  }

  // Currency
  dom.currencySymbol.addEventListener('input', (e) => {
    state.currency = e.target.value || '';
    updateCurrencyDisplay();
    renderAll();
  });

  // Sample Receipt Loader
  dom.loadSampleBtn.addEventListener('click', () => loadSampleReceipt(true));

  // Image Upload / Camera
  dom.selectImageBtn.addEventListener('click', () => dom.receiptFileInput.click());
  dom.receiptFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleReceiptImageFile(file);
  });

  // Drag and drop
  dom.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.dropZone.classList.add('dragover');
  });
  dom.dropZone.addEventListener('dragleave', () => {
    dom.dropZone.classList.remove('dragover');
  });
  dom.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleReceiptImageFile(file);
    } else {
      showToast('Please drop an image file');
    }
  });

  // Remove preview
  dom.removeImageBtn.addEventListener('click', () => {
    state.receiptImage = null;
    dom.imagePreviewContainer.classList.add('hidden');
    dom.receiptFileInput.value = '';
    showToast('Receipt image removed');
  });

  // Add Item Manually
  dom.addItemBtn.addEventListener('click', () => {
    addNewItem('New Item', 1, 0.00);
    renderItemsTable();
    updateCalculations();
  });

  // Service Rate Presets
  dom.servicePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.servicePresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rate = btn.dataset.rate;
      if (rate === 'custom') {
        dom.serviceRateInput.focus();
      } else {
        dom.serviceRateInput.value = rate;
        state.serviceRate = parseFloat(rate) || 0;
        updateCalculations();
      }
    });
  });

  // Custom Service Rate Input
  dom.serviceRateInput.addEventListener('input', (e) => {
    state.serviceRate = parseFloat(e.target.value) || 0;
    let matched = false;
    dom.servicePresetBtns.forEach(b => {
      if (b.dataset.rate === e.target.value) {
        b.classList.add('active');
        matched = true;
      } else {
        b.classList.remove('active');
      }
    });
    if (!matched) {
      document.querySelector('[data-rate="custom"]')?.classList.add('active');
    }
    updateCalculations();
  });

  // Tax Input
  dom.taxAmountInput.addEventListener('input', (e) => {
    state.taxAmount = parseFloat(e.target.value) || 0;
    updateCalculations();
  });

  // Add Friend Form
  dom.addFriendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = dom.friendNameInput.value.trim();
    if (name) {
      addFriend(name);
      dom.friendNameInput.value = '';
      renderFriendsSection();
      renderClaimingSection();
      renderSummarySection();
    }
  });

  // Payer Selection
  dom.payerSelect.addEventListener('change', (e) => {
    state.payerId = e.target.value || null;
    renderSummarySection();
  });

  // Copy WhatsApp summary
  dom.copyWhatsAppBtn.addEventListener('click', copyWhatsAppSummary);

  // Print
  dom.printReceiptBtn.addEventListener('click', () => window.print());

  // Math Explainer Modal
  dom.openMathBtn.addEventListener('click', () => dom.mathModal.classList.remove('hidden'));
  dom.closeMathModalBtn.addEventListener('click', () => dom.mathModal.classList.add('hidden'));
  dom.mathModal.querySelector('.modal-backdrop').addEventListener('click', () => dom.mathModal.classList.add('hidden'));
}

// ============================================================================
// 5. STEP & BOTTOM BAR NAVIGATION
// ============================================================================

function goToStep(stepNumber) {
  state.activeStep = stepNumber;

  // Update top stepper tabs
  dom.stepTabs.forEach(tab => {
    const s = parseInt(tab.dataset.step, 10);
    tab.classList.toggle('active', s === stepNumber);
  });

  // Update active sections
  dom.stepSections.forEach((section, index) => {
    section.classList.toggle('active', (index + 1) === stepNumber);
  });

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh step-specific data
  if (stepNumber === 2) {
    renderFriendsSection();
    renderClaimingSection();
  } else if (stepNumber === 3) {
    renderSummarySection();
  }

  updateBottomBar();
}

function updateBottomBar() {
  const calc = calculateTotals();

  if (state.activeStep === 1) {
    dom.bottomPrevBtn.style.visibility = 'hidden';
    dom.bottomNextBtn.innerHTML = 'Assign Items &rarr;';
    dom.bottomStepIndicator.textContent = 'Step 1 of 3: Items';
    dom.bottomTotalPill.textContent = `Bill: ${state.currency}${calc.grandTotal.toFixed(2)}`;
  } else if (state.activeStep === 2) {
    dom.bottomPrevBtn.style.visibility = 'visible';
    dom.bottomPrevBtn.innerHTML = '&larr; Items';
    dom.bottomNextBtn.innerHTML = 'Summary &rarr;';
    dom.bottomStepIndicator.textContent = 'Step 2 of 3: Claim';
    if (calc.isPerfectMatch) {
      dom.bottomTotalPill.textContent = 'All Items Split! ✅';
      dom.bottomTotalPill.style.color = 'var(--success)';
    } else {
      dom.bottomTotalPill.textContent = `Left: ${state.currency}${calc.unassignedAmount.toFixed(2)} ⚠️`;
      dom.bottomTotalPill.style.color = 'var(--warning)';
    }
  } else if (state.activeStep === 3) {
    dom.bottomPrevBtn.style.visibility = 'visible';
    dom.bottomPrevBtn.innerHTML = '&larr; Claim';
    dom.bottomNextBtn.innerHTML = '📋 WhatsApp';
    dom.bottomStepIndicator.textContent = 'Step 3 of 3: Settle';
    dom.bottomTotalPill.textContent = `Total: ${state.currency}${calc.grandTotal.toFixed(2)}`;
    dom.bottomTotalPill.style.color = 'var(--primary)';
  }
}

function updateCurrencyDisplay() {
  dom.currSymbols.forEach(el => el.textContent = state.currency);
}

// ============================================================================
// 6. ADAPTIVE ITEM EDITOR (Mobile Cards & Desktop Rows)
// ============================================================================

function addNewItem(name = 'Item', qty = 1, price = 0.0) {
  const newItem = {
    id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    name: name,
    qty: qty,
    totalPrice: price,
    shares: {},
    isCustomShare: false,
  };
  state.items.push(newItem);
  return newItem;
}

function deleteItem(itemId) {
  state.items = state.items.filter(item => item.id !== itemId);
  renderItemsTable();
  updateCalculations();
}

function renderItemsTable() {
  const container = dom.itemsListContainer;
  container.innerHTML = '';
  dom.itemCountDisplay.textContent = state.items.length;

  if (state.items.length === 0) {
    dom.emptyItemsState.classList.remove('hidden');
    container.classList.add('hidden');
  } else {
    dom.emptyItemsState.classList.add('hidden');
    container.classList.remove('hidden');
  }

  state.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'receipt-item-card';
    card.dataset.id = item.id;

    card.innerHTML = `
      <div class="item-card-top">
        <input type="text" class="item-name-input" value="${escapeHTML(item.name)}" placeholder="Dish name (e.g. Pizza, Beer)">
      </div>
      <div class="item-card-bottom">
        <!-- Finger-friendly Quantity Stepper -->
        <div class="qty-stepper">
          <button type="button" class="stepper-btn qty-minus-btn" aria-label="Decrease quantity">&minus;</button>
          <input type="number" class="stepper-val-input qty-input" value="${item.qty}" min="1" step="1" inputmode="numeric">
          <button type="button" class="stepper-btn qty-plus-btn" aria-label="Increase quantity">&plus;</button>
        </div>

        <!-- Price Input with currency -->
        <div class="price-box">
          <span class="price-currency-tag">${state.currency}</span>
          <input type="number" class="item-price-input" value="${item.totalPrice.toFixed(2)}" min="0" step="0.01" inputmode="decimal" placeholder="0.00">
        </div>

        <!-- Delete Item Button -->
        <button type="button" class="delete-item-btn" title="Delete item" aria-label="Delete item">&times;</button>
      </div>
    `;

    // Row input listeners
    const nameInput = card.querySelector('.item-name-input');
    const qtyInput = card.querySelector('.qty-input');
    const qtyMinusBtn = card.querySelector('.qty-minus-btn');
    const qtyPlusBtn = card.querySelector('.qty-plus-btn');
    const priceInput = card.querySelector('.item-price-input');
    const delBtn = card.querySelector('.delete-item-btn');

    nameInput.addEventListener('input', (e) => {
      item.name = e.target.value;
    });

    qtyInput.addEventListener('change', (e) => {
      item.qty = Math.max(1, parseInt(e.target.value, 10) || 1);
      qtyInput.value = item.qty;
    });

    qtyMinusBtn.addEventListener('click', () => {
      if (item.qty > 1) {
        item.qty -= 1;
        qtyInput.value = item.qty;
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      item.qty += 1;
      qtyInput.value = item.qty;
    });

    priceInput.addEventListener('input', (e) => {
      item.totalPrice = parseFloat(e.target.value) || 0.00;
      updateCalculations();
    });

    delBtn.addEventListener('click', () => deleteItem(item.id));

    container.appendChild(card);
  });
}

// ============================================================================
// 7. FRIEND MANAGEMENT
// ============================================================================

function addFriend(name) {
  const colorIndex = state.friends.length % FRIEND_PALETTE.length;
  const friend = {
    id: 'f-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    name: name,
    color: FRIEND_PALETTE[colorIndex]
  };
  state.friends.push(friend);

  if (!state.payerId) {
    state.payerId = friend.id;
  }

  showToast(`Added ${name}!`);
}

function removeFriend(friendId) {
  state.friends = state.friends.filter(f => f.id !== friendId);

  state.items.forEach(item => {
    if (item.shares && item.shares[friendId]) {
      delete item.shares[friendId];
    }
  });

  if (state.payerId === friendId) {
    state.payerId = state.friends.length > 0 ? state.friends[0].id : null;
  }

  renderFriendsSection();
  renderClaimingSection();
  renderSummarySection();
}

function renderFriendsSection() {
  const container = dom.friendsPillsContainer;
  container.innerHTML = '';

  const payerSelect = dom.payerSelect;
  payerSelect.innerHTML = '<option value="">Select who paid...</option>';

  state.friends.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.name;
    if (state.payerId === f.id) opt.selected = true;
    payerSelect.appendChild(opt);

    const pill = document.createElement('div');
    pill.className = 'friend-pill';
    pill.innerHTML = `
      <span class="friend-avatar" style="background-color: ${f.color}">
        ${escapeHTML(f.name.charAt(0).toUpperCase())}
      </span>
      <span>${escapeHTML(f.name)}</span>
      <button class="remove-friend-btn" title="Remove ${escapeHTML(f.name)}">&times;</button>
    `;

    pill.querySelector('.remove-friend-btn').addEventListener('click', () => {
      removeFriend(f.id);
    });

    container.appendChild(pill);
  });

  if (state.friends.length === 0) {
    container.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); padding: 4px 0;">No friends added yet. Type a name above!</p>`;
  }
}

// ============================================================================
// 8. ITEM CLAIMING & CUSTOM SHARING
// ============================================================================

function toggleFriendOnItem(itemId, friendId) {
  const item = state.items.find(i => i.id === itemId);
  if (!item) return;

  if (!item.shares) item.shares = {};

  if (item.shares[friendId]) {
    delete item.shares[friendId];
  } else {
    item.shares[friendId] = 1;
  }

  renderClaimingSection();
  updateCalculations();
}

function toggleAllFriendsOnItem(itemId) {
  const item = state.items.find(i => i.id === itemId);
  if (!item) return;

  if (!item.shares) item.shares = {};

  const assignedCount = Object.keys(item.shares).length;

  if (assignedCount === state.friends.length) {
    // If all are already selected, clear selection
    item.shares = {};
  } else {
    // Otherwise select everyone
    state.friends.forEach(f => {
      item.shares[f.id] = 1;
    });
  }

  renderClaimingSection();
  updateCalculations();
}

function adjustFriendPortion(itemId, friendId, delta) {
  const item = state.items.find(i => i.id === itemId);
  if (!item || !item.shares) return;

  const current = item.shares[friendId] || 1;
  const updated = Math.max(0.5, Math.round((current + delta) * 2) / 2);
  item.shares[friendId] = updated;

  renderClaimingSection();
  updateCalculations();
}

function toggleCustomPortionMode(itemId) {
  const item = state.items.find(i => i.id === itemId);
  if (!item) return;

  item.isCustomShare = !item.isCustomShare;
  renderClaimingSection();
}

function renderClaimingSection() {
  const container = dom.claimingCardsContainer;
  container.innerHTML = '';

  if (state.items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No items to claim</p>
        <p class="empty-subtitle">Go back to Step 1 to add or upload items.</p>
      </div>
    `;
    return;
  }

  if (state.friends.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">Add friends first</p>
        <p class="empty-subtitle">Add the people who shared this meal above.</p>
      </div>
    `;
    return;
  }

  state.items.forEach(item => {
    const card = document.createElement('div');
    const assignedFriends = Object.keys(item.shares || {});
    const shareCount = assignedFriends.length;
    const isAllSelected = shareCount === state.friends.length && state.friends.length > 0;

    let statusClass = 'status-unassigned';
    if (shareCount === 1) statusClass = 'status-claimed';
    if (shareCount > 1) statusClass = 'status-shared';

    card.className = `item-claim-card ${statusClass}`;

    const totalWeight = assignedFriends.reduce((sum, fid) => sum + (item.shares[fid] || 1), 0);

    // Build friends touch chips
    let friendsButtonsHTML = '';
    state.friends.forEach(friend => {
      const isSelected = assignedFriends.includes(friend.id);
      friendsButtonsHTML += `
        <button type="button" class="claim-friend-btn ${isSelected ? 'selected' : ''}" data-item-id="${item.id}" data-friend-id="${friend.id}">
          <span class="friend-avatar" style="background-color: ${friend.color}">
            ${escapeHTML(friend.name.charAt(0).toUpperCase())}
          </span>
          <span>${escapeHTML(friend.name)}</span>
          ${isSelected ? `<span class="selected-check">✓</span>` : ''}
        </button>
      `;
    });

    // "Split with Everyone" button
    const splitAllHTML = `
      <button type="button" class="split-all-btn" data-item-id="${item.id}">
        ⚡ ${isAllSelected ? 'Deselect All' : 'Everyone'}
      </button>
    `;

    // Breakdown details string
    let splitSummaryHTML = '';
    if (shareCount === 0) {
      splitSummaryHTML = `<span style="color: var(--warning); font-weight: 700;">⚠️ Not claimed yet</span>`;
    } else if (shareCount === 1) {
      const claimer = state.friends.find(f => f.id === assignedFriends[0]);
      splitSummaryHTML = `<span>Paid by <strong>${escapeHTML(claimer ? claimer.name : '')}</strong> (${state.currency}${item.totalPrice.toFixed(2)})</span>`;
    } else {
      const shareDescriptions = assignedFriends.map(fid => {
        const friend = state.friends.find(f => f.id === fid);
        const weight = item.shares[fid] || 1;
        const portionCost = (item.totalPrice * (weight / totalWeight));
        const fractionText = item.isCustomShare 
          ? `(${weight}/${totalWeight} &bull; ${state.currency}${portionCost.toFixed(2)})`
          : `(1/${shareCount} &bull; ${state.currency}${portionCost.toFixed(2)})`;
        return `${escapeHTML(friend ? friend.name : '')} ${fractionText}`;
      });

      splitSummaryHTML = `
        <div class="split-shares-breakdown">
          Shared: ${shareDescriptions.join(', ')}
        </div>
      `;
    }

    // Custom portion drawer with +/- steppers
    let customPortionHTML = '';
    if (shareCount > 1) {
      customPortionHTML += `
        <div style="text-align: right; margin-top: 4px;">
          <button type="button" class="custom-share-toggle-btn" data-item-id="${item.id}">
            ${item.isCustomShare ? 'Reset to Equal Shares' : 'Split by custom portions / slices'}
          </button>
        </div>
      `;

      if (item.isCustomShare) {
        customPortionHTML += `<div class="custom-portion-box">`;
        customPortionHTML += `<p style="font-size: 0.75rem; font-weight: 700; color: var(--purple); margin-bottom: 8px;">Adjust portions/slices for each person:</p>`;
        assignedFriends.forEach(fid => {
          const friend = state.friends.find(f => f.id === fid);
          const weight = item.shares[fid] || 1;
          customPortionHTML += `
            <div class="portion-row">
              <span>${escapeHTML(friend ? friend.name : '')}</span>
              <div class="portion-stepper">
                <button type="button" class="portion-stepper-btn portion-minus-btn" data-item-id="${item.id}" data-friend-id="${fid}">&minus;</button>
                <span class="portion-display">${weight}</span>
                <button type="button" class="portion-stepper-btn portion-plus-btn" data-item-id="${item.id}" data-friend-id="${fid}">&plus;</button>
              </div>
            </div>
          `;
        });
        customPortionHTML += `</div>`;
      }
    }

    card.innerHTML = `
      <div class="item-claim-top">
        <div>
          <span class="item-claim-desc">${escapeHTML(item.name)}</span>
          ${item.qty > 1 ? `<span class="item-qty-tag">Qty: ${item.qty}</span>` : ''}
        </div>
        <div class="item-claim-price">${state.currency}${item.totalPrice.toFixed(2)}</div>
      </div>

      <div class="claim-actions-row">
        <div class="friends-claim-buttons">
          ${friendsButtonsHTML}
          ${splitAllHTML}
        </div>
        <div class="item-split-detail">
          ${splitSummaryHTML}
        </div>
        ${customPortionHTML}
      </div>
    `;

    // Friend chips toggle
    card.querySelectorAll('.claim-friend-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFriendOnItem(btn.dataset.itemId, btn.dataset.friendId);
      });
    });

    // Split all button
    const splitAllBtn = card.querySelector('.split-all-btn');
    if (splitAllBtn) {
      splitAllBtn.addEventListener('click', () => {
        toggleAllFriendsOnItem(splitAllBtn.dataset.itemId);
      });
    }

    // Custom portion toggle
    const toggleCustomBtn = card.querySelector('.custom-share-toggle-btn');
    if (toggleCustomBtn) {
      toggleCustomBtn.addEventListener('click', () => {
        toggleCustomPortionMode(toggleCustomBtn.dataset.itemId);
      });
    }

    // Portion Stepper buttons
    card.querySelectorAll('.portion-minus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        adjustFriendPortion(btn.dataset.itemId, btn.dataset.friendId, -0.5);
      });
    });

    card.querySelectorAll('.portion-plus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        adjustFriendPortion(btn.dataset.itemId, btn.dataset.friendId, 0.5);
      });
    });

    container.appendChild(card);
  });
}

// ============================================================================
// 9. CALCULATION ENGINE
// ============================================================================

function calculateTotals() {
  const foodSubtotal = state.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const serviceChargeTotal = (foodSubtotal * (state.serviceRate / 100));
  const taxTotal = parseFloat(state.taxAmount) || 0;
  const grandTotal = foodSubtotal + serviceChargeTotal + taxTotal;

  const friendBreakdowns = {};
  state.friends.forEach(f => {
    friendBreakdowns[f.id] = {
      friend: f,
      items: [],
      foodSubtotal: 0,
      serviceCharge: 0,
      tax: 0,
      grandTotal: 0,
    };
  });

  let totalFoodAssigned = 0;

  state.items.forEach(item => {
    const assignedIds = Object.keys(item.shares || {});
    if (assignedIds.length === 0) return;

    const totalWeight = assignedIds.reduce((sum, fid) => sum + (item.shares[fid] || 1), 0);

    assignedIds.forEach(fid => {
      if (!friendBreakdowns[fid]) return;

      const weight = item.shares[fid] || 1;
      const fraction = weight / totalWeight;
      const shareCost = item.totalPrice * fraction;

      friendBreakdowns[fid].items.push({
        name: item.name,
        qty: item.qty,
        shareFraction: fraction,
        shareWeight: weight,
        totalWeight: totalWeight,
        shareAmount: shareCost,
        originalPrice: item.totalPrice,
        sharedWithCount: assignedIds.length,
      });

      friendBreakdowns[fid].foodSubtotal += shareCost;
      totalFoodAssigned += shareCost;
    });
  });

  let sumIndividualTotals = 0;
  state.friends.forEach(f => {
    const b = friendBreakdowns[f.id];

    if (foodSubtotal > 0 && b.foodSubtotal > 0) {
      const proportion = b.foodSubtotal / foodSubtotal;
      b.serviceCharge = serviceChargeTotal * proportion;
      b.tax = taxTotal * proportion;
    } else {
      b.serviceCharge = 0;
      b.tax = 0;
    }

    b.grandTotal = b.foodSubtotal + b.serviceCharge + b.tax;
    sumIndividualTotals += b.grandTotal;
  });

  const unassignedFood = Math.max(0, foodSubtotal - totalFoodAssigned);
  const unassignedWithService = unassignedFood * (1 + (state.serviceRate / 100));
  const isPerfectMatch = unassignedFood < 0.01 && Math.abs(grandTotal - sumIndividualTotals) < 0.02;

  return {
    foodSubtotal,
    serviceChargeTotal,
    taxTotal,
    grandTotal,
    friendBreakdowns,
    totalFoodAssigned,
    unassignedFood,
    unassignedWithService,
    unassignedAmount: unassignedWithService,
    sumIndividualTotals,
    isPerfectMatch
  };
}

function updateCalculations() {
  const calc = calculateTotals();

  dom.subtotalDisplay.textContent = `${state.currency}${calc.foodSubtotal.toFixed(2)}`;
  dom.serviceChargeDisplay.textContent = `${state.currency}${calc.serviceChargeTotal.toFixed(2)}`;
  dom.grandTotalDisplay.textContent = `${state.currency}${calc.grandTotal.toFixed(2)}`;

  if (state.activeStep === 3) {
    renderSummarySection();
  }

  updateBottomBar();
}

// ============================================================================
// 10. SUMMARY & ACCORDION RENDERER
// ============================================================================

function renderSummarySection() {
  const calc = calculateTotals();

  // Balance Banner
  dom.assignedTotalDisplay.textContent = `${state.currency}${calc.sumIndividualTotals.toFixed(2)}`;
  dom.summaryBillTotalDisplay.textContent = `${state.currency}${calc.grandTotal.toFixed(2)}`;

  if (calc.isPerfectMatch) {
    dom.balanceBanner.className = 'balance-banner matched';
    dom.balanceIcon.textContent = '✅';
    dom.balanceTitle.textContent = 'All Items Accounted For!';
    dom.balanceSubtitle.textContent = `Assigned shares match the bill (${state.currency}${calc.grandTotal.toFixed(2)}).`;
  } else {
    dom.balanceBanner.className = 'balance-banner unmatched';
    dom.balanceIcon.textContent = '⚠️';
    dom.balanceTitle.textContent = `Unassigned: ${state.currency}${calc.unassignedAmount.toFixed(2)}`;
    dom.balanceSubtitle.textContent = 'Go back to Step 2 to assign remaining items.';
  }

  // Payer Hero Card
  const payer = state.friends.find(f => f.id === state.payerId);
  const payerBreakdown = payer ? calc.friendBreakdowns[payer.id] : null;
  const payerOwnShare = payerBreakdown ? payerBreakdown.grandTotal : 0;
  const totalOwedToPayer = Math.max(0, calc.grandTotal - payerOwnShare);

  if (payer) {
    dom.payerHeroCard.innerHTML = `
      <div class="payer-hero-content">
        <div>
          <div class="payer-title-tag">The Bill Payer</div>
          <div class="payer-name-large">
            <span>💳 ${escapeHTML(payer.name)}</span>
          </div>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">
            ${escapeHTML(payer.name)} paid <strong>${state.currency}${calc.grandTotal.toFixed(2)}</strong> to the restaurant.
          </p>
        </div>
        <div class="payer-stats-row">
          <div class="payer-stat-box">
            <span class="payer-stat-lbl">${escapeHTML(payer.name)}'s Share</span>
            <span class="payer-stat-amt">${state.currency}${payerOwnShare.toFixed(2)}</span>
          </div>
          <div class="payer-stat-box">
            <span class="payer-stat-lbl">To Receive Back</span>
            <span class="payer-stat-amt highlight">${state.currency}${totalOwedToPayer.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
    dom.payerHeroCard.classList.remove('hidden');
  } else {
    dom.payerHeroCard.innerHTML = `
      <div style="text-align: center; color: #cbd5e1; padding: 10px;">
        <p>No payer selected. Go to Step 2 to pick who paid the bill.</p>
      </div>
    `;
  }

  // Person Cards Grid (Accordion enabled)
  const grid = dom.summaryCardsGrid;
  grid.innerHTML = '';

  state.friends.forEach(f => {
    const b = calc.friendBreakdowns[f.id];
    if (!b) return;

    const isPayer = f.id === state.payerId;
    const card = document.createElement('div');
    // Start expanded on desktop, can be toggled by tap
    card.className = 'person-summary-card';

    let itemsHTML = '';
    if (b.items.length === 0) {
      itemsHTML = `<li class="person-item-row" style="color: var(--text-muted); font-style: italic;">No items claimed</li>`;
    } else {
      b.items.forEach(it => {
        let shareNote = '';
        if (it.sharedWithCount > 1) {
          shareNote = `<span class="person-item-share-info">Shared (${(it.shareFraction * 100).toFixed(0)}% of ${state.currency}${it.originalPrice.toFixed(2)})</span>`;
        }
        itemsHTML += `
          <li class="person-item-row">
            <div class="person-item-name">
              ${escapeHTML(it.name)}
              ${shareNote}
            </div>
            <div class="person-item-price">${state.currency}${it.shareAmount.toFixed(2)}</div>
          </li>
        `;
      });
    }

    let settleHTML = '';
    if (isPayer) {
      settleHTML = `
        <div class="owes-note is-payer">
          👑 Paid bill &bull; Receives back ${state.currency}${totalOwedToPayer.toFixed(2)}
        </div>
      `;
    } else {
      const payerName = payer ? payer.name : 'the payer';
      settleHTML = `
        <div class="owes-note">
          Owes ${escapeHTML(payerName)}: ${state.currency}${b.grandTotal.toFixed(2)}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="person-card-header" role="button" tabindex="0" aria-label="Toggle details for ${escapeHTML(f.name)}">
        <div class="person-identity">
          <span class="friend-avatar" style="background-color: ${f.color}">
            ${escapeHTML(f.name.charAt(0).toUpperCase())}
          </span>
          <span>${escapeHTML(f.name)}</span>
          ${isPayer ? `<span style="font-size: 0.7rem; background: #22c55e; color: #fff; padding: 2px 6px; border-radius: 4px;">Payer</span>` : ''}
        </div>
        <div class="header-right-group">
          <div class="person-total-badge">${state.currency}${b.grandTotal.toFixed(2)}</div>
          <span class="tap-detail-pill">Details <span class="accordion-chevron">&#9660;</span></span>
        </div>
      </div>
      <div class="person-card-body">
        <ul class="person-items-list">
          ${itemsHTML}
        </ul>

        <div class="person-calc-summary">
          <div class="calc-line">
            <span>Items Subtotal:</span>
            <span>${state.currency}${b.foodSubtotal.toFixed(2)}</span>
          </div>
          <div class="calc-line">
            <span>Service Charge (${state.serviceRate}%):</span>
            <span>${state.currency}${b.serviceCharge.toFixed(2)}</span>
          </div>
          ${b.tax > 0 ? `
            <div class="calc-line">
              <span>Tax / Fees:</span>
              <span>${state.currency}${b.tax.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="calc-line total-line">
            <span>Total:</span>
            <span>${state.currency}${b.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        ${settleHTML}
      </div>
    `;

    // Tap header to collapse / expand accordion
    card.querySelector('.person-card-header').addEventListener('click', () => {
      card.classList.toggle('collapsed');
    });

    grid.appendChild(card);
  });
}

// ============================================================================
// 11. WHATSAPP EXPORT
// ============================================================================

function copyWhatsAppSummary() {
  const calc = calculateTotals();
  const payer = state.friends.find(f => f.id === state.payerId);
  const payerName = payer ? payer.name : 'the bill payer';

  let msg = `🧾 *Bill Breakdown - FairShare*\n`;
  msg += `Total Bill: *${state.currency}${calc.grandTotal.toFixed(2)}* (incl. ${state.serviceRate}% service)\n`;
  if (payer) {
    msg += `Paid by: *${payer.name}*\n`;
  }
  msg += `------------------------------------\n\n`;

  state.friends.forEach(f => {
    const b = calc.friendBreakdowns[f.id];
    if (!b) return;

    if (f.id === state.payerId) {
      msg += `👑 *${f.name} (Payer)*\n`;
      msg += `• Own Share: *${state.currency}${b.grandTotal.toFixed(2)}*\n`;
      msg += `• To receive back: *${state.currency}${(calc.grandTotal - b.grandTotal).toFixed(2)}*\n\n`;
    } else {
      msg += `👤 *${f.name} owes ${payerName}: ${state.currency}${b.grandTotal.toFixed(2)}*\n`;
      b.items.forEach(item => {
        const shareLabel = item.sharedWithCount > 1 ? ` (shared)` : '';
        msg += `  • ${item.name}${shareLabel}: ${state.currency}${item.shareAmount.toFixed(2)}\n`;
      });
      msg += `  • Service Charge: ${state.currency}${b.serviceCharge.toFixed(2)}\n\n`;
    }
  });

  msg += `------------------------------------\n`;
  msg += `Calculated with FairShare ✨`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msg).then(() => {
      showToast('Copied summary! Paste directly into WhatsApp.');
    }).catch(() => fallbackCopy(msg));
  } else {
    fallbackCopy(msg);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast('Copied summary to clipboard!');
}

// ============================================================================
// 12. OCR ENGINE
// ============================================================================

function handleReceiptImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    state.receiptImage = e.target.result;
    dom.receiptImagePreview.src = state.receiptImage;
    dom.imagePreviewContainer.classList.remove('hidden');
    runOCRScan(state.receiptImage);
  };
  reader.readAsDataURL(file);
}

async function runOCRScan(imageSrc) {
  if (typeof Tesseract === 'undefined') {
    showToast('OCR library is loading... Please wait a moment.');
    return;
  }

  dom.ocrProgressCard.classList.remove('hidden');
  dom.ocrStatusTitle.textContent = 'Scanning receipt image...';
  dom.ocrStatusSubtitle.textContent = 'Reading text with OCR';
  dom.ocrProgressBar.style.width = '20%';

  try {
    const worker = await Tesseract.createWorker('eng');
    dom.ocrProgressBar.style.width = '60%';

    const result = await worker.recognize(imageSrc);
    await worker.terminate();

    dom.ocrProgressBar.style.width = '100%';
    dom.ocrStatusTitle.textContent = 'Scan Complete!';
    dom.ocrStatusSubtitle.textContent = 'Extracted items';

    const parsedItems = parseReceiptText(result.data.text);

    if (parsedItems.length > 0) {
      state.items = parsedItems;
      renderItemsTable();
      updateCalculations();
      showToast(`Extracted ${parsedItems.length} items from receipt!`);
    } else {
      showToast('Could not auto-detect items. You can add them manually.');
    }

    setTimeout(() => {
      dom.ocrProgressCard.classList.add('hidden');
    }, 1200);

  } catch (err) {
    console.error('OCR Error:', err);
    dom.ocrProgressCard.classList.add('hidden');
    showToast('Receipt scan failed. Please add items manually.');
  }
}

function parseReceiptText(rawText) {
  const lines = rawText.split('\n');
  const items = [];
  const priceRegex = /([£$€])?\s*(\d+[.,]\d{2})(?!\d)/;
  const ignoreKeywords = ['subtotal', 'total', 'balance', 'change', 'cash', 'card', 'visa', 'mastercard', 'vat', 'tax', 'receipt', 'table', 'date', 'server', 'order', 'thank'];

  for (let line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.length < 3) continue;

    const lower = cleanLine.toLowerCase();
    if (ignoreKeywords.some(kw => lower.includes(kw))) continue;

    const match = cleanLine.match(priceRegex);
    if (match) {
      const priceStr = match[2].replace(',', '.');
      const price = parseFloat(priceStr);

      if (isNaN(price) || price <= 0 || price > 5000) continue;

      let namePart = cleanLine.substring(0, match.index).trim();
      if (namePart.length < 2) {
        namePart = cleanLine.substring(match.index + match[0].length).trim();
      }

      let qty = 1;
      const qtyMatch = namePart.match(/^(\d+)\s*[xX]?\s+/);
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1], 10) || 1;
        namePart = namePart.substring(qtyMatch[0].length).trim();
      }

      namePart = namePart.replace(/^[-*•\s]+/, '').replace(/[-*•\s]+$/, '');

      if (namePart.length >= 2) {
        items.push({
          id: 'ocr-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          name: namePart,
          qty: qty,
          totalPrice: price,
          shares: {},
          isCustomShare: false,
        });
      }
    }
  }

  return items;
}

// ============================================================================
// 13. PRESET & STATE HELPERS
// ============================================================================

function loadSampleReceipt(showNotification = true) {
  state.currency = SAMPLE_PRESET.currency;
  state.serviceRate = SAMPLE_PRESET.serviceRate;
  state.taxAmount = SAMPLE_PRESET.taxAmount;
  state.payerId = SAMPLE_PRESET.payerId;

  state.friends = JSON.parse(JSON.stringify(SAMPLE_PRESET.friends));
  state.items = JSON.parse(JSON.stringify(SAMPLE_PRESET.items));

  dom.currencySymbol.value = state.currency;
  dom.serviceRateInput.value = state.serviceRate;
  dom.taxAmountInput.value = state.taxAmount.toFixed(2);

  dom.servicePresetBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.rate === String(state.serviceRate));
  });

  updateCurrencyDisplay();
  renderAll();

  if (showNotification) {
    showToast('Loaded sample restaurant receipt!');
  }
}

function resetState() {
  state.items = [];
  state.friends = [];
  state.payerId = null;
  state.serviceRate = 12.5;
  state.taxAmount = 0.0;
  state.receiptImage = null;
  dom.imagePreviewContainer.classList.add('hidden');
  dom.receiptFileInput.value = '';
}

function renderAll() {
  renderItemsTable();
  renderFriendsSection();
  renderClaimingSection();
  updateCalculations();
}

function showToast(message) {
  const toast = dom.toast;
  toast.textContent = message;
  toast.classList.remove('hidden');

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
