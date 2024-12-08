import useCopyToClipboard from '../composables/useCopyToClipboard';
const vClipboard = {
    mounted(el, binding) {
        // Use the useCopyToClipboard composable
        const { copy } = useCopyToClipboard({
            duration: binding.arg?.duration || 1000, // Optional duration argument
            legacy: binding.arg?.legacy || true, // Optional legacy argument
        });
        // Get the event type from binding.arg, or default to 'click'
        const eventType = binding.arg?.event || 'click';
        // Define the event handler
        const handler = async () => {
            const textToCopy = binding.value; // The text to copy
            if (typeof textToCopy === 'string') {
                copy(textToCopy);
            }
            else {
                console.error('v-clipboard: No valid text provided for copying.');
            }
        };
        // Bind the event listener to the element
        el.addEventListener(eventType, handler);
        // Store the handler on the element for cleanup purposes
        el._vClipboardHandler = handler;
    },
    beforeUnmount(el) {
        // Remove the event listener and clean up
        const handler = el._vClipboardHandler;
        if (handler) {
            el.removeEventListener('click', handler);
            delete el._vClipboardHandler;
        }
    },
};
export default vClipboard;
