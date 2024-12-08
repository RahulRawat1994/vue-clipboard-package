import { ref, computed, type Ref } from 'vue'

interface UseClipboardOptions {
  duration?: number
  legacy?: boolean
}

export default function useClipboard(options: UseClipboardOptions = {}) {
  // Props (Options)
  options.duration = options.duration || 1000
  options.legacy = options.legacy || false

  // Data (Reactive variables)
  const copied: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)

  // Computed Properties
  const isClipboardApiSupported = computed(
    (): boolean =>
      typeof navigator !== 'undefined' &&
      'clipboard' in navigator &&
      window.isSecureContext,
  )

  const isSupported = computed(
    () => isClipboardApiSupported.value || options.legacy,
  )

  // Methods

  /**
   * Check the permission status of clipboard-read or clipboard-write.
   */
  const checkClipboardPermission = async (
    type: PermissionName,
  ): Promise<PermissionState> => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: type })
      return permissionStatus.state // 'granted', 'denied', or 'prompt'
    } catch (err) {
      console.error('Error checking clipboard permission:', err)
      return 'denied'
    }
  }

  /**
   * Copy text to clipboard using Clipboard API or legacy fallback.
   */
  const copy = async (text: string): Promise<void> => {
    if (!isClipboardApiSupported.value && options.legacy)
      return legacyCopy(text)
    const permissionName: PermissionName = 'clipboard-write' as PermissionName
    const permissionState = await checkClipboardPermission(permissionName)

    if (permissionState === 'granted' || permissionState === 'prompt') {
      try {
        await navigator.clipboard.writeText(text)
        setCopy()
      } catch (err) {
        setError(err as Error)
      }
    } else {
      setError(new Error('Clipboard write permission denied'))
    }
  }

  /**
   * Legacy fallback method for copying text using a textarea element.
   */
  const legacyCopy = (text: string): void => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()

    try {
      document.execCommand('copy')
      setCopy()
    } catch (err) {
      setError(err as Error)
    } finally {
      textArea.remove()
    }
  }

  /**
   * Mark the copy action as successful and reset after the duration.
   */
  const setCopy = (): void => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, options.duration)
  }

  /**
   * Handle errors during clipboard operations.
   */
  const setError = (err: Error): void => {
    error.value = err
    setTimeout(() => {
      error.value = null
    }, options.duration)
  }

  // Return (Public API)
  return {
    copied,
    error,
    copy,
    isSupported,
  }
}
