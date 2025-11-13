// src/app/features/users/user-list/models/user.model.ts
export type UserType = 'Member' | 'Instructor';
export type UserStatus = 'Active' | 'Inactive';

export interface UserModel {
  id: number;
  fullName: string;
  email: string;
  gender: 'Male' | 'Female';
  dob: string | Date;
  type: UserType;
  status: UserStatus;
}

export interface UserProfile {
  userId: string;
  bio: string;
  profilePictureUrl: string;
  bannerUrl: string;
  displayName: string;
  mediaLinks: string[];
  mediaDescription: string;
  addressDetails: AddressDetail[];
}

export interface AddressDetail {
  address1: string;
  address2: string;
  state: string;
  country: string;
  pinCode: string;
  addressType: number; // 601
}
