export type Permission = 'read' | 'write' | 'delete';

export type User = {
  readonly id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  department_id: number;
  department_name: string;
  role_id: number;
  role_name: string;
  access_levels: string[];
  created_at: Date;
  last_login_at: Date;
}

export type LoginRequest = Pick<User, 'email'> & {
  password: string;
}

export type RegisterRequest = Omit<User, 'id' | 'department_name' | 'role_name' | 'role_id' | 'access_levels' | 'created_at' | 'last_login_at'> & {
  password: string;
  password_confirm: string;
}

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
}

export type UpdateUser = {
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  phone: string;
  department?: string | null;
}

export type UserStatistics = {
  documents_created: string;
  documents_updated: string;
  drafts_created: string;
  collections_created: string;
  last_action_at: Date;
  last_login_at: Date;
}

export type UserRecentActions = {
  items: UserRecentAction[];
}

export type UserRecentAction = {
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: Date;
}
