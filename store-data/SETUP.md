# HESTIA Shopify Store Setup Guide

This guide details the steps required to configure the Shopify Admin so the store features and mock catalog are fully functional.

## 1. Import Product CSV
1. Log in to your Shopify Admin.
2. Go to **Products**.
3. Click **Import** at the top right.
4. Choose the generated `store-data/products.csv` file.
5. Click **Upload and preview**, then click **Import products**.

## 2. Create Automated Collections
Navigate to **Products** → **Collections** and create the following 5 collections. Ensure they use the exact handles and rules specified below:

1. **New Arrivals**
   - **Collection type**: Automated
   - **Conditions**: Product tag **is equal to** `new-arrivals`
   - **Handle**: `new-arrivals` (or `/collections/new-arrivals`)

2. **The Silk Collection**
   - **Collection type**: Automated
   - **Conditions**: Product tag **is equal to** `silk`
   - **Handle**: `silk` (or `/collections/silk`)

3. **Sleepwear**
   - **Collection type**: Automated
   - **Conditions**: Product type **is equal to** `Sleepwear`
   - **Handle**: `sleepwear`

4. **Loungewear**
   - **Collection type**: Automated
   - **Conditions**: Product type **is equal to** `Loungewear`
   - **Handle**: `loungewear`

5. **Robes**
   - **Collection type**: Automated
   - **Conditions**: Product type **is equal to** `Robes`
   - **Handle**: `robes`

## 3. Navigation Setup
Go to **Online Store** → **Navigation** to configure the menus.

### Main Menu (`main-menu`)
Configure the main menu links as follows:
- **Shop** → Link: `/collections/all` (All Products)
- **Collections** → Link: `/collections` (All Collections)
- **About** → Link: `/pages/about`

> Note: /pages/about must exist first — create an **About** page (Admin → Content → Pages) before linking to it, or the link will 404.

### Footer Menus
Configure footer menus to link to relevant policy/about pages or collection links.

## 4. Search & Discovery App Configuration
1. Install the free **Shopify Search & Discovery** app from the Shopify App Store.
2. Go to **Apps** → **Search & Discovery** → **Filters**.
3. Add the following filter options:
   - **Availability**
   - **Price**
   - **Color** (Standard product options)
   - **Size** (Standard product options)
   - **Fabric** (Select **Tag** prefix or use tag filters)
*Note: If the Search & Discovery app is not yet installed/configured, the theme will automatically fall back to native tag filtering (e.g. `fabric:Silk`, `color:Champagne`).*

## 5. Enable Test Payments
To test the checkout process end-to-end:
1. Go to **Settings** → **Payments**.
2. If Shopify Payments is active, click **Manage**, scroll down to **Test mode**, check **Enable test mode**, and click **Save**.
3. Alternatively, under **Payment providers**, choose a test provider like **(for testing) Bogus Gateway** and activate it.
4. Use credit card number `1` (or `1`, `2`, `3` for CVV/expiry) to complete checkout test transactions.
