# Setup Aiken

This action sets up an Aiken environment for use in a GitHub Actions workflow.

## Inputs

### `version`

**Required** The version of Aiken to install.

## Outputs

### `version`

The version of Aiken that was installed.

## Example usage

```yaml
uses: aiken-lang/setup-aiken@v0.1.0
with:
  version: v1.0.5-alpha
run: aiken fmt --check
run: aiken check
```
