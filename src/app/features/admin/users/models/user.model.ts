export interface UserResponseModel {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  dateOfBirth: string;
  address: Address;
  userRole: string;
  accounts: string[];
  accountNumbers: string[];
  userStatus: string;
}

export interface Address {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateId: string;
  stateName: string;
  pinCode: string;
  userId: string;
}
