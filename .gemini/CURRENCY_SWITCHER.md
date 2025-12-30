# Currency Switcher Feature - USD ⇄ INR

## Overview
Added a dynamic currency switcher that allows users to toggle between US Dollar ($) and Indian Rupee (₹) throughout the dashboard. All monetary values automatically convert based on the selected currency.

## Features Implemented

### 1. Currency Toggle Button
- **Location**: Top right of the dashboard header, next to the Refresh button
- **Display**: Shows current currency symbol and code (e.g., "$ USD" or "₹ INR")
- **Interaction**: Click to switch between currencies
- **Tooltip**: Hover to see "Switch to INR (₹)" or "Switch to USD ($)"

### 2. Real-time Conversion
- **Conversion Rate**: 1 USD = ₹83 (approximately)
- **Automatic Conversion**: All amounts convert instantly when switching currencies
- **Precision**: Displays 2 decimal places for both currencies

### 3. Updated Display Locations

All currency values throughout the dashboard now use the currency switcher:

#### Overview Page
- **Total Expense** stat card
- Shows converted amount based on selected currency

#### Call History Page
- **Cost per execution** in the meta information
- Displays in selected currency for each call

#### Expenses Page
- **Total Expenses** summary card
- **Average Cost per Call** card
- **Cost column** in the expenses table
- All amounts convert based on selection

## Technical Implementation

### State Management
```javascript
const [currency, setCurrency] = useState('USD'); // USD or INR
```

### Conversion Rate
```javascript
const USD_TO_INR = 83;
```

### Currency Formatter Function
```javascript
const formatCurrency = (amount) => {
    if (currency === 'USD') {
        return `$${amount.toFixed(2)}`;
    } else {
        return `₹${(amount * USD_TO_INR).toFixed(2)}`;
    }
};
```

### Currency Symbol Helper
```javascript
const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : '₹';
};
```

## User Experience

### Default State
- Dashboard loads with **USD ($)** as default currency
- All costs display in US Dollars

### Switching Currency
1. Click the currency button in the top right (next to Refresh)
2. Currency instantly switches from USD to INR (or vice versa)
3. All monetary values throughout the dashboard update automatically
4. Button updates to show new currency symbol and code

### Visual Design
- **Button Style**: Minimal black and white design
- **Border**: Subtle gray border matching the theme
- **Hover Effect**: Light gray background
- **Symbol**: Large, bold currency symbol ($ or ₹)
- **Label**: Small currency code (USD or INR)

## Examples

### USD Display
- Total Expense: **$125.50**
- Average Cost: **$2.50**
- Cost per call: **$1.25**

### INR Display (after conversion)
- Total Expense: **₹10,416.50**
- Average Cost: **₹207.50**
- Cost per call: **₹103.75**

## Responsive Design

### Desktop
- Currency button sits next to Refresh button
- Both buttons have adequate spacing
- Full labels visible

### Mobile
- Currency and Refresh buttons stack horizontally
- Both buttons grow to fill available width  
- Currency code label remains visible
- Refresh text hidden to save space

## Future Enhancements (Possible)

1. **Persistent Storage**: Save currency preference in localStorage
2. **More Currencies**: Add EUR, GBP, etc.
3. **Live Exchange Rates**: Fetch real-time conversion rates from API
4. **Auto-detect**: Detect user's location and set default currency
5. **Custom Rate**: Allow admin to set custom conversion rate

## Notes

- Conversion rate (1 USD = ₹83) is hardcoded and can be updated as needed
- All original data is stored in USD; conversion happens only for display
- Backend data remains unchanged; this is a frontend-only feature
- The feature integrates seamlessly with the existing minimal black and white theme
