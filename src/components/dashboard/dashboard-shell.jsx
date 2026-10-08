"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Store as StoreIcon,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Header,
  Input,
  ListBox,
  Select,
  Tabs,
} from "@heroui/react";
import DataTable from "./data-table";
import EntryDialog from "./entry-dialog";
import MemberDialog from "./member-dialog";
import MetricCard from "./metric-card";
import PartyDialog from "./party-dialog";
import QuickCollectionForm from "./quick-collection-form";
import { formatCurrency, formatDate, formatDayLabel } from "../../lib/qatar-format";

const ROLE_LABELS = { admin: "Admin", manager: "Manager", sales_rep: "Sales rep" };
const EXPENSE_CATEGORIES = ["Rent", "Transport", "Bills", "Staff", "Others"];

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function ledgerRows(stores, sales, collections) {
  return stores.map((store) => {
    const storeSales = sales.filter((sale) => sale.store_id === store.id);
    const storeCollections = collections.filter((collection) => collection.store_id === store.id);
    const totalSales = sum(storeSales, "invoice_amount");
    const totalCollected = sum(storeCollections, "amount");
    return {
      ...store,
      total_sales: totalSales,
      total_collected: totalCollected,
      balance_due: totalSales - totalCollected,
      transaction_count: storeSales.length,
    };
  });
}

function SectionHeading({ title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{description}</p>
      </div>
      {action}
    </div>
  );
}

function LedgerTable({ rows, actions }) {
  const columns = [
    {
      key: "store_name",
      label: "Wholesale party",
      render: (row) => (
        <div className="party-cell">
          <span className="party-name">{row.store_name}</span>
          <span className="party-owner">{row.owner_name} · {row.phone}</span>
        </div>
      ),
    },
    { key: "address", label: "Address" },
    { key: "total_sales", label: "Total sales", render: (row) => formatCurrency(row.total_sales) },
    { key: "total_collected", label: "Total collected", render: (row) => formatCurrency(row.total_collected) },
    {
      key: "balance_due",
      label: "Balance due",
      render: (row) => (
        <span className={row.balance_due > 0 ? "due-amount" : "paid-amount"}>
          {formatCurrency(Math.abs(row.balance_due))}{row.balance_due < 0 ? " credit" : ""}
        </span>
      ),
    },
  ];
  return <DataTable label="Wholesale party ledger" columns={columns} rows={rows} rowActions={actions} />;
}

function SalesTable({ rows, stores, users, actions }) {
  const storeById = new Map(stores.map((store) => [store.id, store.store_name]));
  const userById = new Map(users.map((user) => [user.id, user.name]));
  return (
    <DataTable
      label="Wholesale sales"
      rows={rows}
      rowActions={actions}
      columns={[
        { key: "date", label: "Date", render: (row) => formatDate(row.date) },
        { key: "store_id", label: "Wholesale party", render: (row) => storeById.get(row.store_id) || "Party removed" },
        { key: "items_summary", label: "Items / invoice" },
        { key: "created_by_user_id", label: "Recorded by", render: (row) => userById.get(row.created_by_user_id) || "Former member" },
        { key: "invoice_amount", label: "Invoice amount", render: (row) => formatCurrency(row.invoice_amount) },
      ]}
    />
  );
}

function CollectionsTable({ rows, stores, users, actions }) {
  const storeById = new Map(stores.map((store) => [store.id, store.store_name]));
  const userById = new Map(users.map((user) => [user.id, user.name]));
  return (
    <DataTable
      label="Daily collections"
      rows={rows}
      rowActions={actions}
      columns={[
        { key: "date", label: "Date", render: (row) => formatDate(row.date) },
        { key: "store_id", label: "Wholesale party", render: (row) => storeById.get(row.store_id) || "Party removed" },
        { key: "collected_by_user_id", label: "Collected by", render: (row) => userById.get(row.collected_by_user_id) || "Former member" },
        {
          key: "payment_type",
          label: "Payment details",
          render: (row) => row.payment_type === "cheque"
            ? `${row.cheque_no || "Cheque"} · ${row.bank_name || "Bank not set"} · issued ${formatDate(row.issue_date)}`
            : "Cash",
        },
        { key: "status", label: "Status", render: (row) => <Chip size="sm" variant="soft" color={row.status === "pending" ? "warning" : "success"}>{row.status}</Chip> },
        { key: "amount", label: "Amount", render: (row) => <strong className="paid-amount">{formatCurrency(row.amount)}</strong> },
      ]}
    />
  );
}

function ExpensesTable({ rows, users, actions }) {
  const userById = new Map(users.map((user) => [user.id, user.name]));
  return (
    <DataTable
      label="Daily expenses"
      rows={rows}
      rowActions={actions}
      columns={[
        { key: "date", label: "Date", render: (row) => formatDate(row.date) },
        { key: "title", label: "Expense" },
        { key: "category", label: "Category" },
        { key: "note", label: "Note", render: (row) => row.note || "—" },
        { key: "added_by_user_id", label: "Added by", render: (row) => userById.get(row.added_by_user_id) || "Former member" },
        { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
      ]}
    />
  );
}

function Sidebar({ role, user, compact = false, onNavigate }) {
  const items = [
    { label: "Overview", href: "#overview", icon: LayoutDashboard },
    { label: role === "sales_rep" ? "My collections" : "Party ledger", href: role === "sales_rep" ? "#collections" : "#ledger", icon: StoreIcon },
    ...(role !== "sales_rep" ? [{ label: "Daily collections", href: "#collections", icon: Banknote }] : []),
    ...(role === "admin" ? [{ label: "Team", href: "#team", icon: UsersRound }] : []),
  ];
  return (
    <>
      {!compact && (
        <a href="#overview" className="brand" aria-label="Pine and Co home">
          <span className="brand-mark"><StoreIcon size={19} /></span>
          <span className="brand-copy"><strong>pine & co.</strong><small>WHOLESALE OPERATIONS</small></span>
        </a>
      )}
      <p className="nav-caption">WORKSPACE</p>
      <nav className="sidebar-nav" aria-label={compact ? "Mobile navigation" : "Main navigation"}>
        {items.map(({ label, href, icon: Icon }, index) => (
          <a
            key={label}
            href={href}
            onClick={onNavigate}
            className={`sidebar-link ${index === 0 ? "is-active" : ""}`}
          >
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      {!compact && (
        <>
          <div className="sidebar-spacer" />
          <Card className="sidebar-tip">
            <Card.Content>
              <span className="tip-icon"><ShieldCheck size={17} /></span>
              <p className="tip-title">Party ledgers in sync</p>
              <p className="tip-copy">Sales and collections update each party balance.</p>
            </Card.Content>
          </Card>
          <div className="sidebar-bottom">
            <a href="#help" className="sidebar-link"><CircleHelp size={19} /><span>Help center</span></a>
            <div className="sidebar-profile">
              <span className="profile-avatar">{initials(user.name)}</span>
              <div className="profile-info"><strong>{user.name}</strong><span>{ROLE_LABELS[role]}</span></div>
              <LogOut size={17} className="profile-action" aria-hidden="true" />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function DashboardShell({ initialData }) {
  const [data, setData] = useState(initialData);
  const [activeUserId, setActiveUserId] = useState(
    initialData.users.find((user) => user.role === "admin")?.id || initialData.users[0]?.id,
  );
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeUser = data.users.find((user) => user.id === activeUserId) || data.users[0];
  const role = activeUser.role;
  const allLedgerRows = useMemo(
    () => ledgerRows(data.stores, data.sales_transactions, data.collections),
    [data.stores, data.sales_transactions, data.collections],
  );
  const query = search.trim().toLowerCase();
  const filterRows = (rows, parts) => query
    ? rows.filter((row) => parts(row).join(" ").toLowerCase().includes(query))
    : rows;

  const visibleSales = role === "manager"
    ? data.sales_transactions.filter((sale) => data.users.find((user) => user.id === sale.created_by_user_id)?.role !== "admin")
    : data.sales_transactions;
  const visibleCollections = role === "sales_rep"
    ? data.collections.filter((collection) => collection.collected_by_user_id === activeUser.id)
    : role === "manager"
      ? data.collections.filter((collection) => data.users.find((user) => user.id === collection.collected_by_user_id)?.role !== "admin")
      : data.collections;
  const visibleExpenses = role === "manager"
    ? data.expenses.filter((expense) => data.users.find((user) => user.id === expense.added_by_user_id)?.role !== "admin")
    : role === "sales_rep" ? [] : data.expenses;
  const visibleLedger = role === "sales_rep"
    ? allLedgerRows.filter((party) => party.id === activeUser.assigned_store_id)
    : allLedgerRows;

  const ledgerRowsFiltered = filterRows(visibleLedger, (row) => [row.store_name, row.owner_name, row.phone, row.address]);
  const salesRowsFiltered = filterRows(visibleSales, (row) => [
    row.items_summary,
    data.stores.find((store) => store.id === row.store_id)?.store_name,
  ]);
  const collectionRowsFiltered = filterRows(visibleCollections, (row) => [
    data.stores.find((store) => store.id === row.store_id)?.store_name,
    data.users.find((user) => user.id === row.collected_by_user_id)?.name,
    row.payment_type,
    row.cheque_no,
    row.bank_name,
  ]);
  const expenseRowsFiltered = filterRows(visibleExpenses, (row) => [row.title, row.category, row.note]);

  const totalSales = sum(visibleSales, "invoice_amount");
  const totalCollections = sum(visibleCollections, "amount");
  const totalDue = sum(visibleLedger, "balance_due");
  const totalExpenses = sum(visibleExpenses, "amount");
  const todayCollections = visibleCollections.filter((row) => row.date === data.today);
  const todayTotal = sum(todayCollections, "amount");
  const assignedParty = data.stores.find((store) => store.id === activeUser.assigned_store_id);
  const defaultPartyId = activeUser.assigned_store_id || data.stores[0]?.id || "";
  const isAdmin = role === "admin";
  const isManager = role === "manager";

  function updateList(listKey, entry) {
    setData((current) => {
      const rows = current[listKey];
      const index = entry.id ? rows.findIndex((row) => row.id === entry.id) : -1;
      if (index < 0) return { ...current, [listKey]: [{ ...entry, id: entry.id || `${listKey}-${Date.now()}` }, ...rows] };
      const updated = [...rows];
      updated[index] = { ...updated[index], ...entry };
      return { ...current, [listKey]: updated };
    });
  }

  function saveEntry(kind, entry) {
    if (kind === "sale") {
      updateList("sales_transactions", {
        ...entry,
        invoice_amount: entry.invoice_amount,
        created_by_user_id: entry.id
          ? data.sales_transactions.find((sale) => sale.id === entry.id)?.created_by_user_id || activeUser.id
          : activeUser.id,
      });
    } else if (kind === "collection") {
      updateList("collections", {
        ...entry,
        status: entry.id
          ? data.collections.find((collection) => collection.id === entry.id)?.status || "verified"
          : "pending",
        collected_by_user_id: entry.id
          ? data.collections.find((collection) => collection.id === entry.id)?.collected_by_user_id || activeUser.id
          : activeUser.id,
      });
    } else {
      updateList("expenses", {
        title: entry.title,
        amount: entry.amount,
        category: entry.category,
        note: entry.note,
        date: entry.date,
        added_by_user_id: entry.id
          ? data.expenses.find((expense) => expense.id === entry.id)?.added_by_user_id || activeUser.id
          : activeUser.id,
        ...(entry.id ? { id: entry.id } : {}),
      });
    }
  }

  function saveParty(party) {
    const duplicate = data.stores.some(
      (store) => store.id !== party.id && store.store_name.toLowerCase() === party.store_name.toLowerCase(),
    );
    if (duplicate) return "A wholesale party with this name already exists.";
    setData((current) => {
      if (party.id) return { ...current, stores: current.stores.map((store) => store.id === party.id ? { ...store, ...party } : store) };
      return { ...current, stores: [{ ...party, id: `party-${Date.now()}` }, ...current.stores] };
    });
    return "";
  }

  function saveUser(user) {
    const duplicate = data.users.some(
      (item) => item.id !== user.id && item.email.toLowerCase() === user.email.toLowerCase(),
    );
    if (duplicate) return "A team member with this email already exists.";
    setData((current) => {
      if (user.id) return { ...current, users: current.users.map((item) => item.id === user.id ? { ...item, ...user } : item) };
      return { ...current, users: [{ ...user, id: `user-${Date.now()}` }, ...current.users] };
    });
    return "";
  }

  function deleteEntry(listKey, entry, label) {
    if (!window.confirm(`Delete ${label}? This change cannot be undone.`)) return;
    setData((current) => ({
      ...current,
      [listKey]: current[listKey].filter((row) => row.id !== entry.id),
    }));
  }

  function deleteParty(party) {
    if (data.sales_transactions.some((sale) => sale.store_id === party.id) || data.collections.some((collection) => collection.store_id === party.id)) {
      window.alert("This party has ledger activity. Delete its sales and collections before deleting the party.");
      return;
    }
    deleteEntry("stores", party, party.store_name);
  }

  function deleteUser(user) {
    if (user.id === activeUser.id) {
      window.alert("Switch to another role before deleting the active demo user.");
      return;
    }
    if (data.sales_transactions.some((sale) => sale.created_by_user_id === user.id)
      || data.collections.some((collection) => collection.collected_by_user_id === user.id)
      || data.expenses.some((expense) => expense.added_by_user_id === user.id)) {
      window.alert("This user has ledger records. Reassign or remove those records before deleting the user.");
      return;
    }
    deleteEntry("users", user, user.name);
  }

  function switchUser(id) {
    setActiveUserId(String(id));
    setMobileMenuOpen(false);
  }

  const adminMetricCards = [
    { label: "Wholesale sales", value: formatCurrency(totalSales), note: `${visibleSales.length} invoices on the ledger`, icon: PackageCheck, accent: "green" },
    { label: "Total collected", value: formatCurrency(totalCollections), note: `${visibleCollections.length} payments recorded`, icon: Banknote, accent: "blue" },
    { label: "Market due", value: formatCurrency(totalDue), note: `${visibleLedger.length} wholesale parties`, icon: Wallet, accent: "amber" },
    { label: "Total expenses", value: formatCurrency(totalExpenses), note: `${visibleExpenses.length} operating costs`, icon: ReceiptText, accent: "violet" },
  ];

  const salesRowActions = isAdmin ? (row) => (
    <div className="row-action-group">
      <EntryDialog key={`sale-${row.id}`} kind="sale" stores={data.stores} initialValue={row} compact onSubmit={(entry) => saveEntry("sale", entry)} />
      <Button isIconOnly aria-label={`Delete sale ${row.items_summary}`} variant="tertiary" className="delete-row-button" onPress={() => deleteEntry("sales_transactions", row, "this sale")}><X size={17} /></Button>
    </div>
  ) : null;
  const collectionRowActions = isAdmin ? (row) => (
    <div className="row-action-group">
      <EntryDialog key={`collection-${row.id}`} kind="collection" stores={data.stores} initialValue={row} compact onSubmit={(entry) => saveEntry("collection", entry)} />
      <Button isIconOnly aria-label="Delete collection" variant="tertiary" className="delete-row-button" onPress={() => deleteEntry("collections", row, "this collection")}><X size={17} /></Button>
    </div>
  ) : null;
  const expenseRowActions = isAdmin ? (row) => (
    <div className="row-action-group">
      <EntryDialog key={`expense-${row.id}`} kind="expense" categories={data.expense_categories} initialValue={row} compact onSubmit={(entry) => saveEntry("expense", entry)} />
      <Button isIconOnly aria-label="Delete expense" variant="tertiary" className="delete-row-button" onPress={() => deleteEntry("expenses", row, "this expense")}><X size={17} /></Button>
    </div>
  ) : null;

  return (
    <div className="app-shell">
      <aside className="sidebar desktop-sidebar">
        <Sidebar role={role} user={activeUser} />
      </aside>
      <div className="workspace">
        <Header className="topbar">
          <div className="topbar-left">
            <Button
              isIconOnly
              variant="tertiary"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="mobile-menu-toggle"
              onPress={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </Button>
            <span className="topbar-mobile-brand">
              <span className="brand-mark"><StoreIcon size={18} /></span><strong>pine & co.</strong>
            </span>
            <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{ROLE_LABELS[role]} dashboard</strong></div>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} aria-hidden="true" />
              <Input aria-label="Search wholesale records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search parties and records" />
            </label>
            <span className="demo-label"><span /> Demo mode</span>
            <Select aria-label="Switch active demo user" selectedKey={activeUser.id} onSelectionChange={(key) => key && switchUser(key)}>
              <Select.Trigger className="role-select-trigger">
                <Avatar className="role-avatar" aria-hidden="true">{initials(activeUser.name)}</Avatar>
                <Select.Value />
                <Select.Indicator><ChevronDown size={16} /></Select.Indicator>
              </Select.Trigger>
              <Select.Popover>
                <ListBox aria-label="Choose an active user">
                  {data.users.map((user) => (
                    <ListBox.Item key={user.id} id={user.id} textValue={`${ROLE_LABELS[user.role]} ${user.name}`}>
                      <span className="role-option"><span>{ROLE_LABELS[user.role]}</span><small>{user.name}</small></span>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </Header>
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <Button isIconOnly aria-label="Dismiss mobile navigation" variant="tertiary" className="mobile-menu-scrim" onPress={() => setMobileMenuOpen(false)} />
            <aside className="mobile-menu-panel">
              <Sidebar role={role} user={activeUser} compact onNavigate={() => setMobileMenuOpen(false)} />
              <div className="mobile-menu-footer">
                <span className="profile-avatar">{initials(activeUser.name)}</span>
                <div className="profile-info"><strong>{activeUser.name}</strong><span>{ROLE_LABELS[role]}</span></div>
              </div>
            </aside>
          </div>
        )}
        <motion.main
          key={role}
          id="overview"
          className="dashboard-main"
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="page-heading">
            <div>
              <div className="eyebrow"><CalendarDays size={16} /> {formatDayLabel(data.today)}</div>
              <h1>Good morning, {activeUser.name.split(" ")[0]}<span className="heading-period">.</span></h1>
              <p className="page-description">
                {isAdmin ? "Your wholesale business, party balances and team activity." : isManager ? "Today’s sales, collections and party balances across your accounts." : `Your collection summary${assignedParty ? ` for ${assignedParty.store_name}` : ""}.`}
              </p>
            </div>
            {isAdmin && <MemberDialog stores={data.stores} onSubmit={saveUser} />}
            {isManager && (
              <div className="manager-actions">
                <EntryDialog kind="sale" stores={data.stores} defaultStore={defaultPartyId} onSubmit={(entry) => saveEntry("sale", entry)} />
                <EntryDialog kind="collection" stores={data.stores} defaultStore={defaultPartyId} onSubmit={(entry) => saveEntry("collection", entry)} />
                <EntryDialog kind="expense" categories={data.expense_categories} onSubmit={(entry) => saveEntry("expense", entry)} />
              </div>
            )}
          </div>

          {isAdmin || isManager ? (
            <section aria-label="Wholesale summary" className="metrics-grid">
              {adminMetricCards.map((metric) => <MetricCard key={metric.label} {...metric} />)}
            </section>
          ) : (
            <section aria-label="Personal collection summary" className="metrics-grid">
              <MetricCard label="Collected today" value={formatCurrency(todayTotal)} note={`${todayCollections.length} payment${todayCollections.length === 1 ? "" : "s"} received today`} icon={Banknote} accent="green" />
              <MetricCard label="Cash received" value={formatCurrency(sum(todayCollections.filter((row) => row.payment_type === "cash"), "amount"))} note="Today’s cash payments" icon={Wallet} accent="blue" />
              <MetricCard label="Cheque received" value={formatCurrency(sum(todayCollections.filter((row) => row.payment_type === "cheque"), "amount"))} note="Today’s cheque payments" icon={CreditCard} accent="violet" />
            </section>
          )}

          {role === "sales_rep" && (
            <QuickCollectionForm
              key={activeUser.id}
              stores={data.stores}
              defaultStoreId={defaultPartyId}
              today={data.today}
              onSubmit={(entry) => saveEntry("collection", entry)}
            />
          )}

          {isAdmin ? (
            <section className="panel-section" id="ledger">
              <SectionHeading
                title="Wholesale operations"
                description="Party ledgers, invoices, collections and operating costs."
              />
              <Tabs className="wholesale-tabs" defaultSelectedKey="parties">
                <Tabs.ListContainer className="wholesale-tab-container">
                  <Tabs.List aria-label="Wholesale records">
                    <Tabs.Tab id="parties">Party ledger</Tabs.Tab>
                    <Tabs.Tab id="sales">Sales invoices</Tabs.Tab>
                    <Tabs.Tab id="collections">Collections</Tabs.Tab>
                    <Tabs.Tab id="expenses">Expenses</Tabs.Tab>
                    <Tabs.Tab id="team">Team</Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel id="parties" className="wholesale-tab-panel">
                  <SectionHeading
                    title="Wholesale parties"
                    description="Total sales · total collected · balance due"
                    action={<PartyDialog onSubmit={saveParty} />}
                  />
                  <Card className="panel-card table-card">
                    <LedgerTable
                      rows={ledgerRowsFiltered}
                      actions={(party) => (
                        <div className="row-action-group">
                          <PartyDialog key={party.id} party={party} compact onSubmit={saveParty} />
                          <Button isIconOnly aria-label={`Delete ${party.store_name}`} variant="tertiary" className="delete-row-button" onPress={() => deleteParty(party)}><X size={17} /></Button>
                        </div>
                      )}
                    />
                  </Card>
                </Tabs.Panel>
                <Tabs.Panel id="sales" className="wholesale-tab-panel">
                  <SectionHeading title="Sales invoices" description="Wholesale items and invoice values for all parties." action={<EntryDialog kind="sale" stores={data.stores} defaultStore={defaultPartyId} onSubmit={(entry) => saveEntry("sale", entry)} />} />
                  <Card className="panel-card table-card"><SalesTable rows={salesRowsFiltered} stores={data.stores} users={data.users} actions={salesRowActions} /></Card>
                </Tabs.Panel>
                <Tabs.Panel id="collections" className="wholesale-tab-panel">
                  <SectionHeading title="Daily collections" description="Cash and cheque payments received from wholesale parties." action={<EntryDialog kind="collection" stores={data.stores} defaultStore={defaultPartyId} onSubmit={(entry) => saveEntry("collection", entry)} />} />
                  <Card className="panel-card table-card"><CollectionsTable rows={collectionRowsFiltered} stores={data.stores} users={data.users} actions={collectionRowActions} /></Card>
                </Tabs.Panel>
                <Tabs.Panel id="expenses" className="wholesale-tab-panel">
                  <SectionHeading title="Operating expenses" description="Separate records for wholesale business costs." action={<EntryDialog kind="expense" categories={data.expense_categories} onSubmit={(entry) => saveEntry("expense", entry)} />} />
                  <Card className="panel-card table-card"><ExpensesTable rows={expenseRowsFiltered} users={data.users} actions={expenseRowActions} /></Card>
                </Tabs.Panel>
                <Tabs.Panel id="team" className="wholesale-tab-panel">
                  <SectionHeading title="Team members" description={`${data.users.length} people with access to the workspace.`} />
                  <Card className="panel-card table-card">
                    <DataTable
                      label="Team members"
                      rows={data.users}
                      columns={[
                        { key: "name", label: "Name", render: (user) => <div className="party-cell"><span className="party-name">{user.name}</span><span className="party-owner">{user.email}</span></div> },
                        { key: "role", label: "Role", render: (user) => ROLE_LABELS[user.role] },
                        { key: "assigned_store_id", label: "Party assignment", render: (user) => data.stores.find((store) => store.id === user.assigned_store_id)?.store_name || "All parties" },
                      ]}
                      rowActions={(user) => (
                        <div className="row-action-group">
                          <MemberDialog key={user.id} user={user} stores={data.stores} compact onSubmit={saveUser} />
                          <Button isIconOnly aria-label={`Delete ${user.name}`} variant="tertiary" className="delete-row-button" onPress={() => deleteUser(user)}><X size={17} /></Button>
                        </div>
                      )}
                    />
                  </Card>
                </Tabs.Panel>
              </Tabs>
            </section>
          ) : isManager ? (
            <>
              <section className="panel-section" id="ledger">
                <SectionHeading title="Party ledger" description="Customer account balances across all wholesale parties." action={<PartyDialog onSubmit={(party) => saveParty(party)} />} />
                <Card className="panel-card table-card"><LedgerTable rows={ledgerRowsFiltered} /></Card>
              </section>
              <section className="panel-section">
                <SectionHeading title="Sales invoices" description="Wholesale invoices entered by the team." />
                <Card className="panel-card table-card"><SalesTable rows={salesRowsFiltered} stores={data.stores} users={data.users} /></Card>
              </section>
              <section className="panel-section" id="collections">
                <SectionHeading title="Rep collection history" description="Collections logged by sales reps and managers." />
                <Card className="panel-card table-card"><CollectionsTable rows={collectionRowsFiltered} stores={data.stores} users={data.users} /></Card>
              </section>
              <section className="panel-section">
                <SectionHeading title="Daily expenses" description="Current operating expenses." />
                <Card className="panel-card table-card"><ExpensesTable rows={expenseRowsFiltered} users={data.users} /></Card>
              </section>
            </>
          ) : (
            <section className="panel-section" id="collections">
              <SectionHeading title="My collection history" description="Only payments collected by your active sales rep account." />
              <Card className="panel-card table-card">
                <CollectionsTable rows={collectionRowsFiltered} stores={data.stores} users={data.users} />
              </Card>
            </section>
          )}

          {isManager && (
            <div className="manager-note">
              <span className="manager-note-icon"><BriefcaseBusiness size={18} /></span>
              <p>Party balances are calculated from recorded wholesale invoices minus collections received.</p>
            </div>
          )}
          {!isAdmin && !isManager && (
            <p className="privacy-note"><ShieldCheck size={17} /> This view only shows collections you recorded.</p>
          )}
          <footer className="dashboard-footer">
            <span>© 2026 Pine & Co. Wholesale shop management</span>
            <span><Check size={15} /> Demo data · changes reset on refresh</span>
          </footer>
        </motion.main>
      </div>
    </div>
  );
}
