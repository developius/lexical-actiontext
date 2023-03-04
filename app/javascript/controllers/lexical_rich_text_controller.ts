import { Controller } from "@hotwired/stimulus"
import { $getRoot, $insertNodes, createEditor, CreateEditorArgs, LexicalEditor } from 'lexical';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import { registerRichText } from "@lexical/rich-text";

export default class LexicalController extends Controller {
  static targets = ["editor", "input"]

  /**
   * The element to render the editor within.
   */
  declare readonly editorTarget: HTMLElement;
  /**
   * The input field to output the rendered from the editor HTML to.
   */
  declare readonly inputTarget: HTMLInputElement;

  editor: LexicalEditor;
  removeRichTextListener: () => void;
  removeUpdateListener: () => void;

  connect() {
    this.initEditor()
    this.loadInitialState()
    this.removeRichTextListener = registerRichText(this.editor)
    this.registerUpdateListener()
  }

  initEditor() {
    this.editor = createEditor(this.config());
    this.editor.setRootElement(this.editorTarget);
  }

  /**
   * Load the HTML markup into the editor from the input field value.
   */
  loadInitialState() {
    this.editor.update(() => {
      // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser();
      const dom = parser.parseFromString(this.inputTarget.value, "text/html");
    
      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(this.editor, dom);
    
      // Select the root
      $getRoot().select();
    
      // Insert them at a selection.
      $insertNodes(nodes);
    });
  }

  registerUpdateListener() {
    this.removeUpdateListener = this.editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(this.editor, null);
        this.inputTarget.value = htmlString;
      })
    })
  }

  /**
   * The configuration to pass to `createEditor`.
   * @returns The configuration object.
   */
  config(): CreateEditorArgs {
    return {}
  }

  disconnect() {
    this.removeRichTextListener()
    this.removeUpdateListener()
  }
}