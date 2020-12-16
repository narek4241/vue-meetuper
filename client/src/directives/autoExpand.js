export default {
  bind(el) {
    el.__AutoResizer__ = () => {
      setTimeout(() => {
        el.style.cssText = 'height:auto';
        el.style.cssText = `height:${el.scrollHeight + 2}px`;
      }, 0);
    };

    // #note keydown event opt
    el.addEventListener('input', el.__AutoResizer__);
  },

  unbind(el) {
    el.removeEventListener('input', el.__AutoResizer__);
  },
};
