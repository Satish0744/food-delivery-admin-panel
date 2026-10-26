import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Confirm", message, confirmText = "Confirm", danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600 mb-5">{message}</p>
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="btn-outline text-sm">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`${danger ? "btn-danger" : "btn-primary"} text-sm`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}