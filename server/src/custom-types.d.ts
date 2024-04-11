// custom-types.d.ts or any .d.ts file in your project

import 'express-session';

declare module 'express-session' {
  export interface SessionData {
    userId?: number; // or string, depending on your user ID type
  }
}
