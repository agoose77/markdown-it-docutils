import type Token from "markdown-it/lib/token"
import { class_option, unchanged } from "./directiveOptions"
import { Directive, IDirectiveData } from "./directiveStructure"

class BaseAdmonition extends Directive {
  public final_argument_whitespace = true
  public has_content = true
  public option_spec = {
    // TODO handle options
    class: class_option,
    name: unchanged
  }
  public title = ""
  run(data: IDirectiveData): Token[] {
    const newTokens: Token[] = []

    // we create an overall container, then individual containers for the title and body

    const adToken = new this.state.Token("open_admonition", "aside", 1)
    adToken.map = data.map
    adToken.attrSet("class", `admonition ${this.title.toLowerCase()}`)
    newTokens.push(adToken)

    const adTokenTitle = new this.state.Token("open_admonition_title", "div", 1)
    adTokenTitle.attrSet("class", "admonition-title")
    newTokens.push(adTokenTitle)

    // we want the title to be parsed as Markdown during the inline phase
    const title = data.args[0] || this.title
    const titleToken = new this.state.Token("inline", "", 0)
    titleToken.map = [data.map[0], data.map[0]]
    titleToken.content = title
    titleToken.children = []
    newTokens.push(titleToken)

    newTokens.push(new this.state.Token("close_admonition_title", "div", -1))

    const adTokenBody = new this.state.Token("open_admonition_body", "div", 1)
    adTokenBody.map = [data.map[0] + data.bodyOffset, data.map[1]]
    adTokenBody.attrSet("class", "admonition-body")
    newTokens.push(adTokenBody)
    // run a recursive parse on the content of the admonition upto this stage
    const bodyTokens = this.nestedParse(data.body, data.map[0] + data.bodyOffset)
    newTokens.push(...bodyTokens)

    newTokens.push(new this.state.Token("close_admonition_body", "div", 1))

    newTokens.push(new this.state.Token("close_admonition", "aside", -1))

    return newTokens
  }
}

class Admonition extends BaseAdmonition {
  public required_arguments = 1
}

class Attention extends BaseAdmonition {
  public title = "Attention"
}

class Caution extends BaseAdmonition {
  public title = "Caution"
}

class Danger extends BaseAdmonition {
  public title = "Danger"
}

class Error extends BaseAdmonition {
  public title = "Error"
}

class Important extends BaseAdmonition {
  public title = "Important"
}

class Hint extends BaseAdmonition {
  public title = "Hint"
}
class Note extends BaseAdmonition {
  public title = "Note"
}

class SeeAlso extends BaseAdmonition {
  public title = "See Also"
}

class Tip extends BaseAdmonition {
  public title = "Tip"
}

class Warning extends BaseAdmonition {
  public title = "Warning"
}

export const admonitions = {
  admonition: Admonition,
  attention: Attention,
  caution: Caution,
  danger: Danger,
  error: Error,
  important: Important,
  hint: Hint,
  note: Note,
  seealso: SeeAlso,
  tip: Tip,
  warning: Warning
}