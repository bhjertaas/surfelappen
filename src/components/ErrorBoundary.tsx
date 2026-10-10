import { Component, type ComponentChildren } from 'preact';
import { ErrorScreen } from '../screens/ErrorScreen.tsx';

interface State {
  failed: boolean;
}

/** Shows the plain-language error screen instead of a blank page. Nothing is reported anywhere. */
export class ErrorBoundary extends Component<{ children: ComponentChildren }, State> {
  override state: State = { failed: false };

  override componentDidCatch(error: unknown): void {
    console.error(error);
    this.setState({ failed: true });
  }

  override render() {
    return this.state.failed ? <ErrorScreen kind="error" /> : this.props.children;
  }
}
