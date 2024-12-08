# Vue Clipboard Package

A powerful Vue 3 package providing a directive, composable, and component for copying text to the clipboard. This package offers flexible solutions with modern clipboard APIs and fallback mechanisms for legacy browsers.

## Features
* **Directive:** Simple, flexible directive for clipboard functionality.
* **Composable:** Programmatic access to clipboard operations via a composable function.
* **Component:** A complete, customizable button component with feedback for successful or failed clipboard actions.

## Installation
Install the package via npm or yarn:

```bash
npm install vue-clipboard-package
```
or
```bash
yarn add vue-clipboard-package
```

## Usage
### 1. Using the `ClipboardButton` Component
The `ClipboardButton` is a customizable button component with built-in clipboard functionality and feedback (success/error).

**Example**
```vue
<template>
  <ClipboardButton
    :value="textToCopy"
    :disabled="isDisabled"
    copy-label="Copy Text"
    success-label="Copied!"
    error-label="Error Copying"
    tooltip-placement="top"
    feedback-duration="1500"
    legacy="true"
  >
    <template #copy-icon>
      <IconCopy /> <!-- Custom copy icon slot -->
    </template>
    <template #success-icon>
      <IconChecked /> <!-- Custom success icon slot -->
    </template>
    <template #error-icon>
      <IconError /> <!-- Custom error icon slot -->
    </template>
  </ClipboardButton>
</template>

<script setup>
import { ref } from 'vue';
import { ClipboardButton } from 'vue-clipboard-package';

const textToCopy = ref('Hello World');
const isDisabled = ref(false);
</script>

```


**Props**
- `value` (string, required): The text to copy to the clipboard.
- `disabled` (boolean, default: `false`): Disables the clipboard action and UI.
- `copyLabel` (string, default: `'Copy'`): Tooltip or label text before copying.
- `successLabel` (string, default: `'Copied'`): Tooltip or label text after successful copy.
- `errorLabel` (string, default: `'Error'`): Tooltip or label text after a failed copy.
- `tooltipPlacement` (string, default: `'top'`): Position of the tooltip (`top`, `bottom`, `left`, `right`).
- `feedbackDuration` (number, default: `1000`): Duration (ms) to show success or error message.
- `legacy` (boolean, default: `true`): Enables the legacy fallback for older browsers.

**Slots**
- `#copy-icon`: Slot to customize the copy icon.
- `#success-icon`: Slot to customize the success icon.
- `#error-icon`: Slot to customize the error icon.

-----

### 2. Using the `vClipboard` Directive

The `vClipboard` directive provides an easy way to add clipboard functionality to any element.

**Example**
```vue
<template>
  <button v-clipboard="textToCopy">Copy Text</button>
</template>

<script setup>
import { ref } from 'vue';
import { vClipboard } from 'vue-clipboard-package';

const textToCopy = ref('This text will be copied');
</script>

```

**Usage with Event Modifiers**
You can customize the event type (e.g., `click`, `dblclick`) and pass optional arguments like `duration` and `legacy` support via the arg.
```vue
<template>
  <button v-clipboard:click="{ value: textToCopy, duration: 2000, legacy: true }">Copy on Click</button>
</template>
```

**Modifiers**
* `duration` (optional): Duration for which the feedback (success/error) will be shown.
* `legacy` (optional): Enables or disables legacy clipboard fallback.
* `event` (optional): Specify the event type to trigger clipboard copy (e.g., `click`, `dblclick`).


-----

### 3. Using the `useCopyToClipboard` Composable
The `useCopyToClipboard` composable provides programmatic access to clipboard operations, with feedback on success or failure.
**Example**
```vue
<template>
  <div>
    <button @click="handleCopy">Copy to Clipboard</button>
    <p v-if="copied">Copied to clipboard!</p>
    <p v-if="isError">Failed to copy.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCopyToClipboard } from 'vue-clipboard-package';

const { copy, copied, isError } = useCopyToClipboard({ duration: 1500, legacy: true });

const handleCopy = () => {
  copy('Text to be copied');
};
</script>

```
**Return Values**
* `copied` (ref, boolean): true when the text has been successfully copied, false otherwise.
* `isError` (ref, boolean): true when there was an error copying text, false otherwise.
* `copy` (function): Function to copy the provided text to the clipboard.
**Options**
* `duration` (number, default: 1000): Duration (ms) for how long the copied or error state will be active.
* `legacy` (boolean, default: true): Whether to use a legacy fallback for older browsers that do not support the clipboard API.

-----

## API Reference

### Props (for `ClipboardButton`)

| Prop             | Type    | Default      | Description                                                 |
|------------------|---------|--------------|-------------------------------------------------------------|
| `value`          | String  | N/A          | The text to copy to the clipboard. (Required)                |
| `disabled`       | Boolean | `false`      | Disables the clipboard action and UI.                        |
| `copyLabel`      | String  | `'Copy'`     | Tooltip or label text before copying.                        |
| `successLabel`   | String  | `'Copied'`   | Tooltip or label text after successful copy.                 |
| `errorLabel`     | String  | `'Error'`    | Tooltip or label text after a failed copy.                   |
| `tooltipPlacement` | String | `'top'`      | Position of the tooltip relative to the button.              |
| `feedbackDuration` | Number | `1000`       | Duration (in ms) for which feedback (success/error) is shown.|
| `legacy`         | Boolean | `true`       | Enables legacy support for older browsers.                   |

### Slots (for `ClipboardButton`)

| Slot Name       | Description                              |
|-----------------|------------------------------------------|
| `copy-icon`     | Slot for the custom icon before copying. |
| `success-icon`  | Slot for the custom icon after copying.  |
| `error-icon`    | Slot for the custom icon on error.       |

### Emits (for `ClipboardButton`)

| Event   | Payload          | Description                             |
|---------|------------------|-----------------------------------------|
| `copied` | N/A              | Emitted when the text is successfully copied. |
| `error`  | `Error` object   | Emitted when there is an error during copying. |


### Directive Modifiers (for `vClipboard`)

| Modifier      | Type    | Default       | Description                                                                 |
|---------------|---------|---------------|-----------------------------------------------------------------------------|
| `event`       | String  | `'click'`     | Specifies the event type that triggers the copy action (e.g., `click`, `dblclick`). |
| `duration`    | Number  | `1000`        | The duration (in milliseconds) for showing feedback after copying.          |
| `legacy`      | Boolean | `true`        | Enables legacy clipboard support for older browsers using `execCommand`.    |


### Composable Options (for `useCopyToClipboard`)

| Option       | Type    | Default  | Description                                                                  |
|--------------|---------|----------|------------------------------------------------------------------------------|
| `duration`   | Number  | `1000`   | The duration (in milliseconds) for showing feedback after copying.            |
| `legacy`     | Boolean | `true`   | Enables legacy clipboard support for older browsers using `execCommand`.      |

-----
## Installation and Setup
## Register Globally (Optional)
If you want to use the package globally in your Vue application, you can register it in your `main.ts` or `main.js` file:
```typescript
import { createApp } from 'vue';
import App from './App.vue';
import ClipboardPlugin from 'vue-clipboard-package';

const app = createApp(App);
app.use(ClipboardPlugin);
app.mount('#app');

```

-----

## License
This package is licensed under the MIT License.

-----

