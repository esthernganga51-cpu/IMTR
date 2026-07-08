export type PermissionKey = string;

export type UserLike = Readonly<{
  id?: string;
  role?: string;
  permissions?: PermissionKey[];
}>;

