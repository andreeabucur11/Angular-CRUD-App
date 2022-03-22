export class User{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public username!: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
 