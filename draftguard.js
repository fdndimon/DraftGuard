/**
 * DraftGuard v1.0.0
 * Never lose form data to a browser crash again.
 */
class DraftGuard {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;

    // Генерируем уникальный ключ для этой формы на этой странице
    this.storageKey = `dg_${window.location.pathname}_${this.form.id || this.form.name || 'default'}`;
    this.storage = options.sessionOnly ? sessionStorage : localStorage;
    
    this._init();
  }

  _init() {
    this._restoreData();

    // Слушаем любые изменения внутри формы через делегирование
    this.form.addEventListener('input', this._debounce(() => this._saveData(), 500));
    this.form.addEventListener('change', () => this._saveData());

    // Очищаем черновик только при успешной отправке
    this.form.addEventListener('submit', () => this.storage.removeItem(this.storageKey));
  }

  _saveData() {
    const formData = new FormData(this.form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      // Поддержка множественных чекбоксов (массивы значений)
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    
    this.storage.setItem(this.storageKey, JSON.stringify(data));
    
    // Кастомное событие, чтобы UI мог показать "Черновик сохранен"
    this.form.dispatchEvent(new CustomEvent('draft:saved', { detail: { time: new Date() } }));
  }

  _restoreData() {
    const saved = this.storage.getItem(this.storageKey);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      
      Object.entries(data).forEach(([key, value]) => {
        const elements = this.form.querySelectorAll(`[name="${key}"]`);
        
        elements.forEach(el => {
          if (el.type === 'checkbox' || el.type === 'radio') {
            const isArray = Array.isArray(value);
            el.checked = isArray ? value.includes(el.value) : el.value === value;
          } else {
            el.value = value;
          }
        });
      });
      
      this.form.dispatchEvent(new CustomEvent('draft:restored'));
    } catch (e) {
      console.error('DraftGuard: Failed to parse saved data', e);
    }
  }

  // Защита от спама событиями при быстром наборе текста
  _debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
