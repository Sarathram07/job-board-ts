export interface CompanyEntity {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  jobs?: JobEntity[]; //virtual
  users?: UserEntity[]; //virtual
}

export interface JobEntity {
  id: string;
  companyId: string; // UUID of Company
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  company?: CompanyEntity[]; //virtual
}

export interface UserEntity {
  id: string;
  companyId: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;

  company?: CompanyEntity; //virtual
}

export interface MessageEntity {
  id: string;
  user: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;

  userDetails?: UserEntity; // virtual (optional)
}
