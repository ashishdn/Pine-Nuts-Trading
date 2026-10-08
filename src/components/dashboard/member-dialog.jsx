"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { Edit3, Plus, X } from "lucide-react";

export default function MemberDialog({ stores, user, onSubmit, compact = false }) {
  const overlay = useOverlayState();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "sales_rep");
  const [store, setStore] = useState(user ? user.assigned_store_id || "unassigned" : stores[0]?.id || "unassigned");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Enter a name and email address.");
      return;
    }
    const result = onSubmit({
      id: user?.id,
      name: name.trim(),
      email: email.trim(),
      role,
      assigned_store_id: store === "unassigned" ? null : store,
    });
    if (result) {
      setError(result);
      return;
    }
    if (!user) {
      setName("");
      setEmail("");
      setRole("sales_rep");
      setStore(stores[0]?.id || "unassigned");
    }
    setError("");
    overlay.close();
  }

  return (
    <Modal state={overlay}>
      <Modal.Trigger
        aria-label={user ? `Edit ${user.name}` : "Add team member"}
        className={`modal-action-trigger ${compact ? "modal-action-compact" : "modal-action-primary"}`}
      >
        {user ? <Edit3 size={16} /> : <Plus size={16} />}
        {!compact && (user ? "Edit member" : "Add team member")}
      </Modal.Trigger>
      {overlay.isOpen && (
        <Modal.Backdrop>
          <Modal.Container size="md" scroll="outside">
            <Modal.Dialog aria-label={user ? "Edit team member" : "Add a team member"}>
              <form onSubmit={handleSubmit}>
                <Modal.Header className="dialog-header">
                  <div>
                    <Modal.Heading>{user ? "Edit team member" : "Add a team member"}</Modal.Heading>
                    <p className="dialog-description">Manage team access and party assignment.</p>
                  </div>
                  <Modal.CloseTrigger aria-label="Close dialog">
                    <X size={18} />
                  </Modal.CloseTrigger>
                </Modal.Header>
                <Modal.Body className="dialog-body">
                  <TextField className="form-field">
                    <Label className="form-label">Full name</Label>
                    <Input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Team member name"
                      className="form-input"
                    />
                  </TextField>
                  <TextField className="form-field">
                    <Label className="form-label">Email address</Label>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@pineandco.shop"
                      className="form-input"
                    />
                  </TextField>
                  <TextField className="form-field">
                    <Label className="form-label">Role</Label>
                    <Select
                      aria-label="Role"
                      selectedKey={role}
                      onSelectionChange={(key) => key && setRole(String(key))}
                    >
                      <Select.Trigger className="form-select-trigger">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="Available roles">
                          <ListBox.Item id="admin" textValue="Admin">Admin</ListBox.Item>
                          <ListBox.Item id="manager" textValue="Manager">Manager</ListBox.Item>
                          <ListBox.Item id="sales_rep" textValue="Sales rep">Sales rep</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </TextField>
                  <TextField className="form-field">
                    <Label className="form-label">Assigned wholesale party</Label>
                    <Select
                      aria-label="Assigned wholesale party"
                      selectedKey={store}
                      onSelectionChange={(key) => setStore(key ? String(key) : "")}
                    >
                      <Select.Trigger className="form-select-trigger">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label="Available wholesale parties">
                          <ListBox.Item id="unassigned" textValue="No assigned party">No assigned party</ListBox.Item>
                          {stores.map((item) => (
                            <ListBox.Item key={item.id} id={item.id} textValue={item.store_name}>{item.store_name}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </TextField>
                  {error && <p className="form-error" role="alert">{error}</p>}
                </Modal.Body>
                <Modal.Footer className="dialog-footer">
                  <Button type="button" variant="tertiary" onPress={overlay.close}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">{user ? "Save member" : "Add member"}</Button>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      )}
    </Modal>
  );
}
