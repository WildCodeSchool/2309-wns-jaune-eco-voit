import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import {
  CreateUserInput,
  UpdateUserInputId,
  UserEntity,
} from "../entities/user.entity";
import UsersService from "../services/users.service";

@Resolver(() => UserEntity)
export default class UserResolver {
  @Query(() => [UserEntity])
  async listUsers() {
    const users = await new UsersService().listUser();

    if (!users) {
      throw new Error("No data found");
    }
    return users;
  }

  @Query(() => UserEntity)
  async findUserById(@Arg("id") id: string) {
    const user = await new UsersService().findUserById(id);
    if (!user) throw new Error("No data found");
    return user;
  }

  @Query(() => UserEntity)
  async findUserByEmail(@Arg("email") email: string) {
    const user = await new UsersService().findUserById(email);
    if (!user) throw new Error("No data found");
    return user;
  }

  @Mutation(() => UserEntity)
  async createUser(@Arg("data") data: CreateUserInput) {
    return new UsersService().create(data);
  }

  @Mutation(() => UserEntity)
  async updateUser(@Args() { id, data }: UpdateUserInputId) {
    return await new UsersService().updateUser(id, data);
  }

  @Mutation(() => UserEntity)
  async archiveUser(@Arg("id") id: string) {
    return new UsersService().updateUser(id, { status: "ARCHIVED" });
  }
}
