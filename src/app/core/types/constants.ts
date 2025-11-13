export const productStatus = {
  Draft: { label: 'Draft', value: 501 },
  PendingApproval: { label: 'Pending Approval', value: 505 },
  Scheduled: { label: 'Scheduled', value: 510 },
  Published: { label: 'Published', value: 515 },
  InStock: { label: 'In Stock', value: 520 },
  OutOfStock: { label: 'Out of Stock', value: 525 },
  Delete: { label: 'Delete', value: 530 },
};
export const paymentMode = {
  Test: { label: 'Test', value: 1 },
  Production: { label: 'Production', value: 0 },
};

export const paymentStatus = {
  Paid: { label: 'Paid', value: 301 },
  Pending: { label: 'Pending', value: 306 },
  Failed: { label: 'Failed', value: 311 },
  Refunded: { label: 'Refunded', value: 316 },
  Cancelled: { label: 'Cancelled', value: 321 },
};

export const paymentType = {
  Package: { label: 'Package', value: 101 },
  Order: { label: 'Order', value: 106 },
  Appointment: { label: 'Appointment', value: 111 },
};
export const discountType = {
  Percentage: { label: 'Percentage', value: 301 },
  Rupee: { label: 'Rupee', value: 305 },
};

export const doctorServiceType = {
  FirstAppointment: { label: 'First Appointment', value: 401 },
  SecondAppointment: { label: 'Second Appointment', value: 405 },
  PackageAppointment: { label: 'Package Appointment', value: 410 },
};

export const masterImageType = {
  Brand: { label: 'Brand', value: 1 },
  Category: { label: 'Category', value: 2 },
  SubCategory: { label: 'Sub Category', value: 3 },
  UOM: { label: 'Unit of Measurement', value: 4 },
};

export const productImageType = {
  YoutubeVideo: { label: 'Youtube Video', value: 1 },
  Image: { label: 'Video', value: 2 },
  Document: { label: 'Image', value: 3 },
};

export const inventoryStatus = {
  InStock: { label: 'In Stock', value: 1 },
  LowStock: { label: 'Low Stock', value: 2 },
  OutOfStock: { label: 'Out of Stock', value: 3 },
};

export const storeType = {
  Offline: { label: 'Offline', value: 1 },
  Online: { label: 'Online', value: 2 },
};
export const Status = {
  Active: { label: 'Active', value: 1 },
  Inactive: { label: 'Inactive', value: 2 },
};

export const Gender = {
  Male: { label: 'Male', value: 1 },
  Female: { label: 'Female', value: 2 },
  Other: { label: 'Other', value: 3 },
};
export const ApprovalStatus = {
  Pending: { label: 'Pending', value: 1 },
  Approved: { label: 'Approved', value: 2 },
  Rejected: { label: 'Rejected', value: 3 },
};
export const UserType = {
  Instructor: { label: 'Instructor', value: 1 },
  Member: { label: 'Member', value: 2 },
};
