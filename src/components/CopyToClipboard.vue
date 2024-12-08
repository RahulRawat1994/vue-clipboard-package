<template>
  <span
    v-tooltip="{ location: tooltipPlacement, text: tooltipContent, disabled }"
    class="clipboard"
    :class="{ 'clipboard-disabled': disabled }"
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
</style>
