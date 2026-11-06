---
"@nexub/react": minor
"@nexub/icons": minor
"@nexub/core": minor
---

States and safety.

- **`EmptyStatePreset`** (new): ready-made empty states (`noData`, `noResults`, `noAccess` for 403, `serverError` for 500, `offline`), with an icon, localised title and description, and optional `actions`. Errors are announced. `EmptyState` itself stays a server component.
- **`AlertDialog.Confirm`**: type-to-confirm for irreversible actions. The Action button stays disabled until the given `text` (for example, the resource name) is typed.
- **`OTPInput`** (new, beta): one box per digit with `autocomplete="one-time-code"`, so codes from SMS fill every box. Supports paste-to-fill, Backspace and arrow keys, `onComplete`, `mode="alphanumeric"`, `invalid` and `name` for forms.
- **`FileUpload.Item`**: `progress` (0–100) shows a bar, `onCancel` swaps the remove button for "Cancel upload" while uploading, and `error` shows why a file failed. Your app does the upload.
- **Icons**: `Inbox`, `ServerCrash`, `WifiOff`.
- New messages: `emptyStates`, `typeToConfirm`, `verificationCode`, `uploadProgress`, `cancelUpload`.
