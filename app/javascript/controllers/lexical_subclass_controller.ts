/**
 * Don't use this controller! It's to illustrate the issues outlined in the README.
 */

import { registerRichText } from "@lexical/rich-text";
import LexicalBaseController from "./lexical_base_controller";

export default class LexicalController extends LexicalBaseController {
  registerPlugins(): void {
    this.listeners.push(
      registerRichText(this.editor)
    )
  }

  /**
   * The configuration to pass to `createEditor`.
   * @returns The configuration object.
   */
  config() {
    return {}
  }
}