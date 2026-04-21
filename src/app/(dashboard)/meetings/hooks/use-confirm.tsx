import { JSX, useState } from "react";

type ConfirmState = {
  resolve: (value: boolean) => void;
} | null;

export const useConfirm = (
  title: string,
  description: string,
): [() => JSX.Element | null, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<ConfirmState>(null);

  // 🔥 trigger confirm
  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };

  // close dialog
  const handleClose = () => {
    setPromise(null);
  };

  // confirm action
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  // cancel action
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  // 🧱 modal component
  const ConfirmationDialog = () => {
    if (!promise) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{description}</p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return [ConfirmationDialog, confirm];
};
