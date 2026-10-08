"use client";

import { useState } from "react";
import { Button, Input, Label, ListBox, Select, TextField } from "@heroui/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function QuickCollectionForm({ stores, defaultStoreId, today, onSubmit }) {
  const [storeId, setStoreId] = useState(defaultStoreId || stores[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today || "");
  const [paymentType, setPaymentType] = useState("cash");
  const [chequeNo, setChequeNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const selectedStore = stores.find((store) => store.id === storeId);

  function handleSubmit(event) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!storeId) {
      setError("Choose a wholesale party.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (paymentType === "cheque" && (!chequeNo.trim() || !bankName.trim() || !issueDate)) {
      setError("Enter the cheque number, bank name, and issue date.");
      return;
    }
    onSubmit({
      store_id: storeId,
      amount: parsedAmount,
      date,
      payment_type: paymentType,
      cheque_no: paymentType === "cheque" ? chequeNo.trim() : null,
      bank_name: paymentType === "cheque" ? bankName.trim() : null,
      issue_date: paymentType === "cheque" ? issueDate : null,
    });
    setAmount("");
    setChequeNo("");
    setBankName("");
    setIssueDate("");
    setError("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  }

  return (
    <form className="quick-form" onSubmit={handleSubmit}>
      <div className="quick-form-heading">
        <div>
          <h2 className="section-title">Log a collection</h2>
          <p className="section-subtitle">
            Record a payment from {selectedStore?.store_name || "a wholesale party"}.
          </p>
        </div>
        <span className="quick-form-mark"><ArrowUpRight size={17} /></span>
      </div>
      <div className="quick-form-grid">
        <TextField className="form-field">
          <Label className="form-label">Wholesale party</Label>
          <Select
            aria-label="Wholesale party"
            selectedKey={storeId || null}
            onSelectionChange={(key) => setStoreId(key ? String(key) : "")}
          >
            <Select.Trigger className="form-select-trigger">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Wholesale parties">
                {stores.map((store) => (
                  <ListBox.Item key={store.id} id={store.id} textValue={store.store_name}>
                    {store.store_name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </TextField>
        <TextField className="form-field">
          <Label className="form-label">Amount (QAR)</Label>
          <Input
            type="number"
            min="1"
            step="1"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 12500"
            className="form-input"
          />
        </TextField>
        <TextField className="form-field">
          <Label className="form-label">Payment type</Label>
          <Select
            aria-label="Payment type"
            selectedKey={paymentType}
            onSelectionChange={(key) => key && setPaymentType(String(key))}
          >
            <Select.Trigger className="form-select-trigger">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Payment types">
                <ListBox.Item id="cash" textValue="Cash">Cash</ListBox.Item>
                <ListBox.Item id="cheque" textValue="Cheque">Cheque</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </TextField>
        <TextField className="form-field">
          <Label className="form-label">Collection date</Label>
          <Input
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="form-input"
          />
        </TextField>
        {paymentType === "cheque" && (
          <>
            <TextField className="form-field">
              <Label className="form-label">Cheque number</Label>
              <Input required value={chequeNo} onChange={(event) => setChequeNo(event.target.value)} placeholder="e.g. CHQ-20501" className="form-input" />
            </TextField>
            <TextField className="form-field">
              <Label className="form-label">Bank name</Label>
              <Input required value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="Bank name" className="form-input" />
            </TextField>
            <TextField className="form-field">
              <Label className="form-label">Issue date</Label>
              <Input required type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className="form-input" />
            </TextField>
          </>
        )}
      </div>
      <div className="quick-form-footer">
        {error ? (
          <p className="form-error" role="alert">{error}</p>
        ) : saved ? (
          <p className="form-success"><CheckCircle2 size={17} /> Collection saved to the party ledger.</p>
        ) : (
          <p className="form-hint">Only your collections are shown in your activity history.</p>
        )}
        <Button type="submit" variant="primary">Save collection</Button>
      </div>
    </form>
  );
}
