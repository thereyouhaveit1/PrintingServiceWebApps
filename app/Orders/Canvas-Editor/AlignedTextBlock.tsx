
import "../../app.css";
import { BlockTool } from '@editorjs/editorjs';

export default class AlignedTextBlock implements BlockTool {
  private data: any;
  private config: any;
  private api: any;
  private textarea!: HTMLDivElement;

  constructor({ data, config, api }: { data: any; config?: any; api: any }) {
    this.data = data || { text: '', alignment: 'left', textColor: '#000000', backgroundColor: '#ffffff' };
    this.config = config || {};
    this.api = api;
  }

  render() {
    // Create a wrapper div for the block
    const wrapper = document.createElement('div');
    wrapper.className = 'aligned-text-wrapper';
    wrapper.style.textAlign = this.data.alignment;

    // Create alignment buttons
    const controls = document.createElement('div');
    controls.className = 'alignment-controls';

    ['left', 'center', 'right'].forEach((align) => {
      const btn = document.createElement('button');
      btn.innerText = align;
      btn.onclick = () => {
        this.data.alignment = align;
        wrapper.style.textAlign = align;
      };
      controls.appendChild(btn);
    });

    // Create the editable text area
    this.textarea = document.createElement('div');
    this.textarea.contentEditable = "true";
    this.textarea.innerHTML = this.data.text;
    this.textarea.className = 'aligned-text-editor';

    // Color controls for text and background
    const colorControls = document.createElement('div');
    colorControls.className = 'color-controls';

    const textColorInput = document.createElement('input');
    textColorInput.type = 'color';
    textColorInput.value = this.data.textColor || '#000000';
    textColorInput.oninput = () => {
      this.data.textColor = textColorInput.value;
      this.textarea.style.color = textColorInput.value;
    };

    const bgColorInput = document.createElement('input');
    bgColorInput.type = 'color';
    bgColorInput.value = this.data.backgroundColor || '#ffffff';
    bgColorInput.oninput = () => {
      this.data.backgroundColor = bgColorInput.value;
      this.textarea.style.backgroundColor = bgColorInput.value;
    };

    colorControls.appendChild(textColorInput);
    colorControls.appendChild(bgColorInput);

    // Append all elements
    wrapper.appendChild(controls);
    wrapper.appendChild(this.textarea);
    wrapper.appendChild(colorControls);

    // Apply initial colors
    this.textarea.style.color = this.data.textColor || '#000000';
    this.textarea.style.backgroundColor = this.data.backgroundColor || '#ffffff';

    return wrapper;
  }

  save() {
    // Return the block data when saving
    return {
      text: this.textarea.innerHTML,
      alignment: this.data.alignment,
      textColor: this.data.textColor,
      backgroundColor: this.data.backgroundColor,
    };
  }

  static get toolbox() {
    // Define the toolbox for this custom tool
    return {
      title: 'Aligned Text',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>', // Simple icon
    };
  }
}