import { getQatarDate } from "./qatar-format";

const EXPENSE_CATEGORIES = ["Rent", "Transport", "Bills", "Staff", "Others"];

function dateOffset(days) {
  const date = new Date(`${getQatarDate()}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const stores = [
  {
    id: "party-central",
    store_name: "Central Market Traders",
    owner_name: "Farhana Islam",
    phone: "+974 5512 3456",
    address: "Shop 18, Doha Wholesale Market, Doha, Qatar",
  },
  {
    id: "party-riverside",
    store_name: "Riverside Grocers",
    owner_name: "Mizanur Rahman",
    phone: "+974 6614 2265",
    address: "12 River Road, Al Wakrah, Qatar",
  },
  {
    id: "party-hilltop",
    store_name: "Hilltop General Store",
    owner_name: "Sadia Akter",
    phone: "+974 5511 4827",
    address: "7 College Road, Al Rayyan, Qatar",
  },
  {
    id: "party-lakeside",
    store_name: "Lakeside Wholesale",
    owner_name: "Tanvir Ahmed",
    phone: "+974 6618 9302",
    address: "44 Lake View, Lusail, Qatar",
  },
  {
    id: "party-oldtown",
    store_name: "Old Town Provisions",
    owner_name: "Nusrat Jahan",
    phone: "+974 5515 6722",
    address: "29 Souq Street, Doha, Qatar",
  },
];

const users = [
  {
    id: "user-admin",
    name: "Amara Rahman",
    email: "amara@pineandco.shop",
    role: "admin",
    assigned_store_id: null,
  },
  {
    id: "user-manager",
    name: "Rafiq Hasan",
    email: "rafiq@pineandco.shop",
    role: "manager",
    assigned_store_id: null,
  },
  {
    id: "user-maya",
    name: "Maya Chowdhury",
    email: "maya@pineandco.shop",
    role: "sales_rep",
    assigned_store_id: "party-central",
  },
  {
    id: "user-imran",
    name: "Imran Hossain",
    email: "imran@pineandco.shop",
    role: "sales_rep",
    assigned_store_id: "party-riverside",
  },
  {
    id: "user-chloe",
    name: "Chloe D'Souza",
    email: "chloe@pineandco.shop",
    role: "sales_rep",
    assigned_store_id: "party-hilltop",
  },
];

const sales_transactions = [
  { id: "sale-001", store_id: "party-central", items_summary: "Mixed nuts · 24 cartons", invoice_amount: 68400, date: dateOffset(0), created_by_user_id: "user-manager" },
  { id: "sale-002", store_id: "party-riverside", items_summary: "Premium almonds · 12 cartons", invoice_amount: 45200, date: dateOffset(0), created_by_user_id: "user-manager" },
  { id: "sale-003", store_id: "party-hilltop", items_summary: "Pistachios · 18 cartons", invoice_amount: 53900, date: dateOffset(-1), created_by_user_id: "user-maya" },
  { id: "sale-004", store_id: "party-lakeside", items_summary: "Cashews · 20 cartons", invoice_amount: 79200, date: dateOffset(-1), created_by_user_id: "user-imran" },
  { id: "sale-005", store_id: "party-oldtown", items_summary: "Walnuts · 14 cartons", invoice_amount: 47600, date: dateOffset(-2), created_by_user_id: "user-manager" },
  { id: "sale-006", store_id: "party-central", items_summary: "Cashews · 16 cartons", invoice_amount: 52800, date: dateOffset(-2), created_by_user_id: "user-maya" },
  { id: "sale-007", store_id: "party-riverside", items_summary: "Pine nuts · 10 cartons", invoice_amount: 62800, date: dateOffset(-3), created_by_user_id: "user-imran" },
  { id: "sale-008", store_id: "party-hilltop", items_summary: "Mixed nuts · 22 cartons", invoice_amount: 64100, date: dateOffset(-4), created_by_user_id: "user-chloe" },
  { id: "sale-009", store_id: "party-lakeside", items_summary: "Almonds · 15 cartons", invoice_amount: 56800, date: dateOffset(-5), created_by_user_id: "user-manager" },
  { id: "sale-010", store_id: "party-oldtown", items_summary: "Pistachios · 12 cartons", invoice_amount: 42600, date: dateOffset(-6), created_by_user_id: "user-maya" },
  { id: "sale-011", store_id: "party-central", items_summary: "Walnuts · 19 cartons", invoice_amount: 58900, date: dateOffset(-7), created_by_user_id: "user-manager" },
  { id: "sale-012", store_id: "party-riverside", items_summary: "Mixed nuts · 17 cartons", invoice_amount: 49300, date: dateOffset(-8), created_by_user_id: "user-imran" },
  { id: "sale-013", store_id: "party-hilltop", items_summary: "Cashews · 11 cartons", invoice_amount: 37100, date: dateOffset(-9), created_by_user_id: "user-chloe" },
  { id: "sale-014", store_id: "party-lakeside", items_summary: "Pine nuts · 13 cartons", invoice_amount: 74300, date: dateOffset(-10), created_by_user_id: "user-manager" },
  { id: "sale-015", store_id: "party-oldtown", items_summary: "Almonds · 20 cartons", invoice_amount: 71500, date: dateOffset(-11), created_by_user_id: "user-maya" },
];

const collections = [
  { id: "collection-001", store_id: "party-central", amount: 42800, payment_type: "cash", cheque_no: null, bank_name: null, issue_date: null, collected_by_user_id: "user-maya", date: dateOffset(0), status: "verified" },
  { id: "collection-002", store_id: "party-riverside", amount: 36500, payment_type: "cheque", cheque_no: "CHQ-20481", bank_name: "Qatar National Bank", issue_date: dateOffset(0), collected_by_user_id: "user-imran", date: dateOffset(0), status: "pending" },
  { id: "collection-003", store_id: "party-hilltop", amount: 29750, payment_type: "cash", cheque_no: null, bank_name: null, issue_date: null, collected_by_user_id: "user-chloe", date: dateOffset(0), status: "verified" },
  { id: "collection-004", store_id: "party-central", amount: 58200, payment_type: "cash", cheque_no: null, bank_name: null, issue_date: null, collected_by_user_id: "user-maya", date: dateOffset(-1), status: "verified" },
  { id: "collection-005", store_id: "party-riverside", amount: 44200, payment_type: "cheque", cheque_no: "CHQ-20476", bank_name: "Commercial Bank of Qatar", issue_date: dateOffset(-1), collected_by_user_id: "user-imran", date: dateOffset(-1), status: "verified" },
  { id: "collection-006", store_id: "party-hilltop", amount: 31800, payment_type: "cash", cheque_no: null, bank_name: null, issue_date: null, collected_by_user_id: "user-chloe", date: dateOffset(-1), status: "verified" },
  { id: "collection-007", store_id: "party-lakeside", amount: 51600, payment_type: "cash", cheque_no: null, bank_name: null, issue_date: null, collected_by_user_id: "user-manager", date: dateOffset(-2), status: "verified" },
  { id: "collection-008", store_id: "party-riverside", amount: 38900, payment_type: "cheque", cheque_no: "CHQ-20462", bank_name: "Doha Bank", issue_date: dateOffset(-2), collected_by_user_id: "user-imran", date: dateOffset(-2), status: "verified" },
  { id: "collection-009", store_id: "party-hilltop", amount: 27400, payment_type: "cash", cheque_no: null, bank_name: null, issue_date: null, collected_by_user_id: "user-chloe", date: dateOffset(-2), status: "verified" },
  { id: "collection-010", store_id: "party-central", amount: 49300, payment_type: "cheque", cheque_no: "CHQ-20450", bank_name: "Qatar Islamic Bank", issue_date: dateOffset(-3), collected_by_user_id: "user-maya", date: dateOffset(-3), status: "verified" },
  { id: "collection-011", store_id: "party-oldtown", amount: 33700, payment_type: "cash", cheque_no: null, bank_name: null, issue_date: null, collected_by_user_id: "user-manager", date: dateOffset(-3), status: "verified" },
  { id: "collection-012", store_id: "party-lakeside", amount: 29100, payment_type: "cheque", cheque_no: "CHQ-20438", bank_name: "Dukhan Bank", issue_date: dateOffset(-3), collected_by_user_id: "user-manager", date: dateOffset(-3), status: "verified" },
];

const expenses = [
  { id: "expense-001", title: "Warehouse rent", amount: 32000, category: "Rent", note: "Monthly warehouse rent", added_by_user_id: "user-manager", date: dateOffset(0) },
  { id: "expense-002", title: "City delivery", amount: 4850, category: "Transport", note: "Wholesale delivery route", added_by_user_id: "user-imran", date: dateOffset(0) },
  { id: "expense-003", title: "Electricity and water", amount: 5750, category: "Bills", note: "Warehouse utilities", added_by_user_id: "user-manager", date: dateOffset(-1) },
  { id: "expense-004", title: "Packing supplies", amount: 3800, category: "Others", note: "Bulk shipment packaging", added_by_user_id: "user-maya", date: dateOffset(-1) },
  { id: "expense-005", title: "Team wages", amount: 18500, category: "Staff", note: "Daily warehouse team", added_by_user_id: "user-manager", date: dateOffset(-2) },
  { id: "expense-006", title: "Regional freight", amount: 7200, category: "Transport", note: "Freight to Al Rayyan", added_by_user_id: "user-chloe", date: dateOffset(-3) },
];

export function getMockData() {
  return {
    users: users.map((user) => ({ ...user })),
    stores: stores.map((store) => ({ ...store })),
    sales_transactions: sales_transactions.map((sale) => ({ ...sale })),
    collections: collections.map((collection) => ({ ...collection })),
    expenses: expenses.map((expense) => ({ ...expense })),
    expense_categories: [...EXPENSE_CATEGORIES],
    today: dateOffset(0),
  };
}
