import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const ManualImportModal = ({ show, handleClose, handleImport }) => {
  const [contactsText, setContactsText] = useState('');
  const [validatedContacts, setValidatedContacts] = useState([]);
  const [removeDuplication, setRemoveDuplication] = useState(true);

  const processContacts = () => {
    const lines = contactsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [name, number] = line.split(',');
        return { name: name?.trim(), number: number?.trim() };
      });

    let uniqueContacts = lines;
    if (removeDuplication) {
      const seen = new Set();
      uniqueContacts = lines.filter(contact => {
        const id = `${contact.name}-${contact.number}`;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }

    setValidatedContacts(uniqueContacts);
    handleImport(uniqueContacts);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Manual Import</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Enter contacts</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Line per number, name then mobile (e.g. John Doe,917941591230)"
            value={contactsText}
            onChange={(e) => setContactsText(e.target.value)}
          />
        </Form.Group>

        <hr />
     
        <Form.Check
          className="mt-2"
          type="checkbox"
          label="Remove duplication"
          checked={removeDuplication}
          onChange={(e) => setRemoveDuplication(e.target.checked)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={processContacts}>Import</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManualImportModal;
