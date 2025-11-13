import { environment as devEnv } from './environment';
const version = '0.1.0';

export const environment:any = {
  ...devEnv,
  production: true,
  appVersion: version,
  apiUrl: '',
};
