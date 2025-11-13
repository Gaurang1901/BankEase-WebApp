export interface BaseLoginCredentials {
  type: 'account' | 'otp' | 'admin';
  rememberMe?: boolean;
}

export interface AccountLoginCredentials extends BaseLoginCredentials {
  type: 'account';
  accountNumber: string;
  password: string;
}

export interface OTPLoginCredentials extends BaseLoginCredentials {
  type: 'otp';
  accountNumber: string;
  otp: string;
}

export interface AdminLoginCredentials extends BaseLoginCredentials {
  type: 'admin';
  email: string;
  password: string;
}

export type LoginCredentials =
  | AccountLoginCredentials
  | OTPLoginCredentials
  | AdminLoginCredentials;

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female';
  phoneNo: string;
  dob: string | Date;
  role: 'User' | 'Admin';
  address: AddressModel;
}

export interface AddressModel {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
