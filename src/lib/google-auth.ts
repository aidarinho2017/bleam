declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleAuthConfig {
  clientId: string;
}

export class GoogleAuth {
  private clientId: string;

  constructor(config: GoogleAuthConfig) {
    this.clientId = config.clientId;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleCredentialResponse.bind(this),
        });
        resolve();
      } else {
        // Wait for Google script to load
        const checkGoogle = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: this.clientId,
              callback: this.handleCredentialResponse.bind(this),
            });
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      }
    });
  }

  private handleCredentialResponse(response: any) {
    // This will be handled by the component that triggers sign-in
    console.log('Google credential response:', response);
  }

  renderButton(element: HTMLElement): void {
    if (window.google) {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
      });
    }
  }

  async signIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Sign-In not loaded'));
        return;
      }

      // Override the callback temporarily for this sign-in attempt
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => {
          if (response.credential) {
            resolve(response.credential);
          } else {
            reject(new Error('No credential received'));
          }
        },
      });

      window.google.accounts.id.prompt();
    });
  }
}

// You'll need to get this from Google Cloud Console
export const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

export const googleAuth = new GoogleAuth({
  clientId: GOOGLE_CLIENT_ID,
});