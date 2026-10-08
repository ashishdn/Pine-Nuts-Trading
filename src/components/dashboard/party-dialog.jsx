"use client";

import { useState } from "react";
import { Button, Input, Label, Modal, TextField, useOverlayState } from "@heroui/react";
import { Edit3, Plus, X } from "lucide-react";
import { normalizeQatarPhone } from "../../lib/qatar-format";

const fields = [
  ["store_name", "Store name", "e.g. Central Market Traders"],
  ["owner_name", "Owner name", "Party owner"],
  ["phone", "Phone", "+974 5512 3456"],
  ["address", "Address", "Street, zone, city, Qatar"],
];

export default function PartyDialog({ party, onSubmit, compact = false }) {
  const overlay = useOverlayState();
  const [values, setValues] = useState(() => ({
    store_name: party?.store_name || "",
    owner_name: party?.owner_name || "",
    phone: party?.phone || "",
    address: party?.address || "",
  }));
  const [error, setError] = useState("");

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const missingField = fields.find(([key]) => !values[key].trim());
    if (missingField) {
      setError(`${missingField[1]} is required.`);
      return;
    }
    const phone = normalizeQatarPhone(values.phone);
    if (!phone) {
      setError("Enter a valid Qatar phone number with an 8-digit local number.");
      return;
    }
    const result = onSubmit({ ...values, phone, id: party?.id });
    if (result) {
      setError(result);
      return;
    }
    setError("");
    overlay.close();
  }

  return (
    <Modal state={overlay}>
      <Modal.Trigger
        aria-label={party ? `Edit ${party.store_name}` : "Add wholesale party"}
        className={`modal-action-trigger ${compact ? "modal-action-compact" : "modal-action-primary"}`}
      >
        {party ? <Edit3 size={16} /> : <Plus size={16} />}
        {!compact && (party ? "Edit party" : "Add party")}
      </Modal.Trigger>
      {overlay.isOpen && (
        <Modal.Backdrop>
          <Modal.Container size="md" scroll="outside">
            <Modal.Dialog aria-label={party ? "Edit wholesale party" : "Add wholesale party"}>
              <form onSubmit={handleSubmit}>
                <Modal.Header className="dialog-header">
                  <div>
                    <Modal.Heading>{party ? "Edit wholesale party" : "Add wholesale party"}</Modal.Heading>
                    <p className="dialog-description">Keep each customer’s contact and ledger details together.</p>
                  </div>
                  <Modal.CloseTrigger aria-label="Close dialog"><X size={18} /></Modal.CloseTrigger>
                </Modal.Header>
                <Modal.Body className="dialog-body">
                {fields.map(([key, label, placeholder]) => (
                  <TextField className="form-field" key={key}>
                    <Label className="form-label">{label}</Label>
                    <Input
                      required
                      type={key === "phone" ? "tel" : "text"}
                      inputMode={key === "phone" ? "tel" : undefined}
                      autoComplete={key === "phone" ? "tel" : undefined}
                      value={values[key]}
                      onChange={(event) => update(key, event.target.value)}
                      placeholder={placeholder}
                      className="form-input"
                    />
                  </TextField>
                ))}
                {error && <p className="form-error" role="alert">{error}</p>}
                </Modal.Body>
                <Modal.Footer className="dialog-footer">
                  <Button type="button" variant="tertiary" onPress={overlay.close}>Cancel</Button>
                  <Button type="submit" variant="primary">{party ? "Save party" : "Add party"}</Button>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      )}
    </Modal>
  );
}
