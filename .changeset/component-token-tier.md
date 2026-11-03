---
'@nexub/tokens': minor
'@nexub/react': minor
---

Component token tier. Button, the text fields (Input, Textarea, Select), Card and Badge now read component tokens such as `--button-filled-bg`, `--field-border` and `--card-radius`, each falling back to the role it used before, so nothing changes by default. Set one on any element to restyle that component below it, without changing the roles other components share. The tokens are unset by default, so nested `data-theme`, `data-contrast` and `data-product` keep working. The list is published in DTCG format as `@nexub/tokens/json/component`, and a test keeps it in step with the components.
