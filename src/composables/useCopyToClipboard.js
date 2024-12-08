import { ref, computed } from 'vue';
export default function useClipboard(options = {}) {
    // Props (Options)
    options.duration = options.duration || 1000;
    options.legacy = options.legacy || false;
    // Data (Reactive variables)
    const copied = ref(false);
    const error = ref(null);
    // Computed Properties
    const isClipboardApiSupported = computed(() => typeof navigator !== 'undefined' &&
        'clipboard' in navigator &&
        window.isSecureContext);
    const isSupported = computed(() => isClipboardApiSupported.value || options.legacy);
    // Methods
    /**
     * Check the permission status of clipboard-read or clipboard-write.
     */
    const checkClipboardPermission = async (type) => {
        try {
            const permissionStatus = await navigator.permissions.query({ name: type });
            return permissionStatus.state; // 'granted', 'denied', or 'prompt'
        }
        catch (err) {
            console.error('Error checking clipboard permission:', err);
            return 'denied';
        }
    };
    /**
     * Copy text to clipboard using Clipboard API or legacy fallback.
     */
    const copy = async (text) => {
        if (!isClipboardApiSupported.value && options.legacy)
            return legacyCopy(text);
        const permissionName = 'clipboard-write';
        const permissionState = await checkClipboardPermission(permissionName);
        if (permissionState === 'granted' || permissionState === 'prompt') {
            try {
                await navigator.clipboard.writeText(text);
                setCopy();
            }
            catch (err) {
                setError(err);
            }
        }
        else {
            setError(new Error('Clipboard write permission denied'));
        }
    };
    /**
     * Legacy fallback method for copying text using a textarea element.
     */
    const legacyCopy = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopy();
        }
        catch (err) {
            setError(err);
        }
        finally {
            textArea.remove();
        }
    };
    /**
     * Mark the copy action as successful and reset after the duration.
     */
    const setCopy = () => {
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, options.duration);
    };
    /**
     * Handle errors during clipboard operations.
     */
    const setError = (err) => {
        error.value = err;
        setTimeout(() => {
            error.value = null;
        }, options.duration);
    };
    // Return (Public API)
    return {
        copied,
        error,
        copy,
        isSupported,
    };
}
