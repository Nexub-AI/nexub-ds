---
"@nexub/react": patch
---

`Toaster` clears its pending "remove from the store" timers when it unmounts, so none fires after the tree is gone (it could throw in test environments after teardown).
