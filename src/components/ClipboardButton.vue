<template>
  <span
    class="clipboard"
    :data-tooltip="tooltipPlacement"
    :class="{ 'clipboard-disabled ': disabled,  }"
  >
    <slot v-if="copied" name="success-icon">
      <IconChecked />
    </slot>
    <slot v-else-if="error" name="error-icon">
      <IconError />
    </slot>
    <slot v-else name="copy-icon" :copy="copy">
      <span
        :class="disabled ? 'pointer-none' : 'cursor-pointer'"
        @click="copy(value)"
      >
        <IconCopy />
      </span>
    </slot>
    <div class="tooltip" >{{ tooltipContent }}</div>
  </span>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import IconChecked from './icons/IconChecked.vue'
import IconCopy from './icons/IconCopy.vue'
import IconError from './icons/IconError.vue'
import useCopyToClipboard from '../composables/useCopyToClipboard'

// Define the emits for the component
const emits = defineEmits<{
  (e: 'copied'): void
  (e: 'error', error: Error): void // Updated to pass the error message
}>()

// Define the props with types and default values using withDefaults
const props = withDefaults(
  defineProps<{
    value: string
    disabled?: boolean
    copyLabel?: string
    errorLabel?: string
    successLabel?: string
    tooltipPlacement?: string
    feedbackDuration?: number
    legacy?: boolean
  }>(),
  {
    disabled: false,
    copyLabel: 'Copy',
    errorLabel: 'Error',
    successLabel: 'Copied',
    tooltipPlacement: 'top',
    feedbackDuration: 1000,
    legacy: true,
  },
)

// Use the clipboard composable
const { copied, error, copy } = useCopyToClipboard({
  duration: props.feedbackDuration,
  legacy: props.legacy,
})

// Compute the tooltip content based on the current state
const tooltipContent = computed(() => {
  if (copied.value) {
    emits('copied')
    return props.successLabel
  } else if (error.value) {
    emits('error', error.value)
    return props.errorLabel
  } else {
    return props.copyLabel
  }
})
</script>
<style lang="css" scoped>
.clipboard-disabled .pointer-none {
  pointer-events: none;
}
.clipboard-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.clipboard {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin: 20px; /* Adds space for each container */
}

.tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap; /* Ensures text stays in one line */
}

/* Show tooltip on hover */
.clipboard:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

/* Tooltip positions */
.clipboard[data-tooltip="top"] .tooltip {
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
}

.clipboard[data-tooltip="bottom"] .tooltip {
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
}

.clipboard[data-tooltip="left"] .tooltip {
  top: 50%;
  right: 120%;
  transform: translateY(-50%);
}

.clipboard[data-tooltip="right"] .tooltip {
  top: 50%;
  left: 120%;
  transform: translateY(-50%);
}

/* Disable tooltip */
.clipboard-disabled .tooltip {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none;
  cursor: default;
}
</style>
