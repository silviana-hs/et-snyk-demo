import { WebComponent, Button, TextInput } from '.';

class WebComponentEnsurer {
  constructor(private component: WebComponent) {
  }

  public async textIs(expected: string) {
    const text = await this.component.getText();

    if (expected.trim() !== text.trim()) {
      throw new Error(`Element ${this.component.selector} text is '${text}'. Expected value is '${expected}'`);
    }
  }

  public async isVisible() {
    if (!await this.component.isDisplayed()) {
      throw new Error(`Element ${this.component.selector} is not visible`);
    }
  }

  public async isNotVisible() {
    if (await this.component.isDisplayed()) {
      throw new Error(`Element ${this.component.selector} is visible`);
    }
  }

  public async expectedStyle(styleName: string, expectedStyle: string) {
    const currentStyle = await this.component.getCssValue(styleName);
    if (currentStyle.trim() !== expectedStyle.trim()) {
      throw new Error(`Element ${this.component.selector} style is '${currentStyle}'. Expected value is '${expectedStyle}'`);
    }
  }
}

class ButtonEnsurer extends WebComponentEnsurer {
  protected button: Button;
  constructor(button: Button) {
    super(button);
    this.button = button;
  }

  public async isNotDisabled() {
    if (await this.button.isDisabled()) {
      throw new Error(`Button ${this.button.selector} is disabled`);
    }
  }
}

class TextInputEnsurer extends WebComponentEnsurer {
  constructor(element: TextInput) {
    super(element);
  }
}

export function ensure(component: Button): ButtonEnsurer;
export function ensure(component: TextInput): TextInputEnsurer;
export function ensure(component: WebComponent): WebComponentEnsurer;
export function ensure(component: WebComponent | Button): any {
    if (component instanceof Button) {
        return new ButtonEnsurer(component);
    } else if (component instanceof WebComponent) {
        return new WebComponentEnsurer(component);
    }
}
