/**
 * Don't use this controller! It's to illustrate the issues outlined in the README.
 * It's designed to be extended by a subclass to extend the Lexical plugins and configuration whilst providing a stable base.
 */

import { Controller } from "@hotwired/stimulus"
import { $getRoot, $insertNodes, createEditor, CreateEditorArgs, LexicalEditor } from 'lexical';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';

export default class LexicalBaseController extends Controller {
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
  listeners: (()=>void)[] = []

  connect() {
    this.initEditor()
    this.loadInitialState()
    this.registerPlugins();
    this.registerUpdateListener()
  }

  initEditor() {
    this.editor = createEditor(this.config());
    this.editor.setRootElement(this.editorTarget);
  }

  /**
   * Load the HTML markup into the editor.
   * @param html Pass a string of HTML here to initialize the editor with the given markup. If this value is falsey, the HTML markup is read from the inputTarget's value.
   */
  loadInitialState(html?: string) {
    this.editor.update(() => {
      // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser();
      const dom = parser.parseFromString(html || this.inputTarget.value, "text/html");
    
      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(this.editor, dom);
    
      // Select the root
      $getRoot().select();
    
      // Insert them at a selection.
      $insertNodes(nodes);
    });
  }

  registerUpdateListener() {
    this.listeners.push(
      this.editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(this.editor, null);
          this.inputTarget.value = htmlString;
        })
      })
    )
  }

  /**
   * Override this method to register Lexical plugins.
   * Please ensure to use `this.listeners.push(<registration method callback>)` so they are cleaned up properly when unmounting.
   */
  registerPlugins() {}

  /**
   * The configuration to pass to `createEditor`.
   * @returns The configuration object.
   */
  config(): CreateEditorArgs {
    throw new Error('Please implement the #config method in your subclassed controller. This method should return the configuration to pass to Lexical.')
  }

  disconnect() {
    this.cleanup()
    this.clearListeners()
  }

  /**
   * Perform any clean up you wish to before the editor is unmounted.
   */
  cleanup() {}

  clearListeners() {
    this.listeners.forEach(listener => listener())
    this.listeners = [];
  }
}