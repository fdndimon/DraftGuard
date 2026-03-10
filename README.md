# 🛡️ DraftGuard

**Zero-dependency form auto-saver.**

Ever typed a long message, accidentally refreshed the page, and lost everything? DraftGuard prevents this exact scenario. It silently saves form progress to `localStorage` as the user types, and automatically restores it if the session is interrupted.

### ✨ Features
- **Set & Forget**: Attach it to any `<form>` and it handles the rest.
- **Smart Tracking**: Uses event delegation to track inputs without memory leaks.
- **Debounced Saving**: Saves data efficiently without thrashing the disk.
- **Auto-Cleanup**: Automatically purges the saved draft when the form is successfully submitted.
- **Supports Complex Inputs**: Handles text, textareas, radio buttons, and multi-select checkboxes out of the box.

### Demo:
```html
https://fdndimon.github.io/DraftGuard/
```

### 🚀 Usage

```html
<script src="draftguard.js"></script>
<script>
  // Just point it to your form
  new DraftGuard('#myForm');
</script>
```
### 📡 Events
DraftGuard emits custom events so your UI can react (like showing a "Saved at 12:00" indicator):
* draft:saved
* draft:restored
