"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { Edit3, Plus, X } from "lucide-react";
import { getQatarDate } from "../../lib/qatar-format";

const KIND_LABELS = {
  sale: { title: "Wholesale sale", action: "Save sale", noun: "sale" },
  collection: { title: "Record collection", action: "Save collection", noun: "collection" },
  expense: { title: "Record expense", action: "Save expense", noun: "expense" },
};

function Field({ label, children }) {
  return (
    <TextField className="form-field">
      <Label className="form-label">{label}</Label>
      {children}
    </TextField>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <Select
        aria-label={label}
        selectedKey={value || null}
        onSelectionChange={(key) => onChange(key == null ? "" : String(key))}
      >
        <Select.Trigger className="form-select-trigger">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox aria-label={label}>
            {options.map((option) => (
              <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                {option.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </Field>
  );
}

export default function EntryDialog({
  kind,
  stores,
  categories = [],
  defaultStore,
  initialValue,
  compact = false,
  onSubmit,
}) {
  const overlay = useOverlayState();
  const [storeId, setStoreId] = useState(initialValue?.store_id || defaultStore || "");
  const [amount, setAmount] = useState(String(initialValue?.amount ?? initialValue?.invoice_amount ?? ""));
  const [date, setDate] = useState(initialValue?.date || "");
  const [itemsSummary, setItemsSummary] = useState(initialValue?.items_summary || "");
  const [paymentType, setPaymentType] = useState(initialValue?.payment_type || "cash");
  const [chequeNo, setChequeNo] = useState(initialValue?.cheque_no || "");
  const [bankName, setBankName] = useState(initialValue?.bank_name || "");
  const [issueDate, setIssueDate] = useState(initialValue?.issue_date || "");
  const [title, setTitle] = useState(initialValue?.title || "");
  const [category, setCategory] = useState(initialValue?.category || categories[0] || "");
  const [note, setNote] = useState(initialValue?.note || "");
  const [error, setError] = useState("");
  const config = KIND_LABELS[kind];
  const isEditing = Boolean(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (kind !== "expense" && !storeId) {
      setError("Choose a wholesale party.");
      return;
    }
    if (kind === "sale" && !itemsSummary.trim()) {
      setError("Add an item or invoice summary.");
      return;
    }
    if (kind === "collection" && paymentType === "cheque" && (!chequeNo.trim() || !bankName.trim() || !issueDate)) {
      setError("Enter the cheque number, bank name, and issue date.");
      return;
    }
    if (kind === "expense" && (!title.trim() || !category)) {
      setError("Enter an expense title and category.");
      return;
    }

    onSubmit({
      id: initialValue?.id,
      store_id: kind === "expense" ? null : storeId,
      amount: parsedAmount,
      invoice_amount: parsedAmount,
      date: date || getQatarDate(),
      items_summary: itemsSummary.trim(),
      payment_type: paymentType,
      cheque_no: paymentType === "cheque" ? chequeNo.trim() : null,
      bank_name: paymentType === "cheque" ? bankName.trim() : null,
      issue_date: paymentType === "cheque" ? issueDate : null,
      title: title.trim(),
      category,
      note: note.trim(),
    });
    setError("");
    overlay.close();
  }

  const triggerLabel = compact ? (isEditing ? "Edit" : `Add ${config.noun}`) : (isEditing ? "Edit entry" : `Add ${config.noun}`);

  return (
    <Modal state={overlay}>
      <Modal.Trigger
        aria-label={triggerLabel}
        className={`modal-action-trigger ${compact ? "modal-action-compact" : kind === "collection" || kind === "sale" ? "modal-action-primary" : "modal-action-secondary"}`}
      >
        {isEditing ? <Edit3 size={16} /> : <Plus size={16} />}
        {!compact && (isEditing ? "Edit entry" : `Add ${config.noun}`)}
      </Modal.Trigger>
      {overlay.isOpen && (
        <Modal.Backdrop>
          <Modal.Container size="md" scroll="outside">
            <Modal.Dialog aria-label={`${isEditing ? "Edit" : "Add"} ${config.noun}`}>
              <form onSubmit={handleSubmit}>
                <Modal.Header className="dialog-header">
                  <div>
                    <Modal.Heading>{isEditing ? `Edit ${config.noun}` : config.title}</Modal.Heading>
                    <p className="dialog-description">Update the wholesale ledger with accurate details.</p>
                  </div>
                  <Modal.CloseTrigger aria-label="Close dialog"><X size={18} /></Modal.CloseTrigger>
                </Modal.Header>
                <Modal.Body className="dialog-body">
                {kind !== "expense" && (
                  <SelectField
                    label="Wholesale party"
                    value={storeId}
                    onChange={setStoreId}
                    options={stores.map((store) => ({ value: store.id, label: store.store_name }))}
                  />
                )}
                {kind === "sale" && (
                  <Field label="Items / invoice summary">
                    <TextArea
                      required
                      value={itemsSummary}
                      onChange={(event) => setItemsSummary(event.target.value)}
                      placeholder="e.g. Cashews · 10 cartons"
                      rows={2}
                      className="form-input form-textarea"
                    />
                  </Field>
                )}
                {kind === "expense" && (
                  <>
                    <Field label="Expense title">
                      <Input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Warehouse rent" className="form-input" />
                    </Field>
                    <SelectField
                      label="Category"
                      value={category}
                      onChange={setCategory}
                      options={categories.map((item) => ({ value: item, label: item }))}
                    />
                    <Field label="Note">
                      <TextArea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional details" rows={2} className="form-input form-textarea" />
                    </Field>
                  </>
                )}
                <Field label={kind === "sale" ? "Invoice amount (QAR)" : "Amount (QAR)"}>
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
                </Field>
                {kind === "collection" && (
                  <>
                    <SelectField
                      label="Payment type"
                      value={paymentType}
                      onChange={setPaymentType}
                      options={[
                        { value: "cash", label: "Cash" },
                        { value: "cheque", label: "Cheque" },
                      ]}
                    />
                    {paymentType === "cheque" && (
                      <>
                        <Field label="Cheque number">
                          <Input required value={chequeNo} onChange={(event) => setChequeNo(event.target.value)} placeholder="e.g. CHQ-20501" className="form-input" />
                        </Field>
                        <Field label="Bank name">
                          <Input required value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="Bank name" className="form-input" />
                        </Field>
                        <Field label="Cheque issue date">
                          <Input required type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className="form-input" />
                        </Field>
                      </>
                    )}
                  </>
                )}
                <Field label="Entry date">
                  <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="form-input" />
                </Field>
                {error && <p className="form-error" role="alert">{error}</p>}
                </Modal.Body>
                <Modal.Footer className="dialog-footer">
                  <Button type="button" variant="tertiary" onPress={overlay.close}>Cancel</Button>
                  <Button type="submit" variant="primary">{isEditing ? "Save changes" : config.action}</Button>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      )}
    </Modal>
  );
}
