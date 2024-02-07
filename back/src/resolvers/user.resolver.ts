import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  UpdateUserInputId,
  UserEntity,
  UserMessage,
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

  @Query(() => UserMessage)
  async login(@Arg("data") data: LoginInput) {
    const userService = new UsersService();
    const user = await userService.findUserByEmail(data.email);

    const errorMessage = new UserMessage();
    errorMessage.success = false;
    errorMessage.message = "Vérifier vos informations";

    const successMessage = new UserMessage();
    successMessage.success = true;
    successMessage.message = "Bienvenue !";

    if (!user) {
      return errorMessage;
    }

    const isPasswordOk = data.password === user.password;

    return isPasswordOk ? successMessage : errorMessage;
  }

  @Mutation(() => UserMessage)
  async register(@Arg("data") data: CreateUserInput) {
    const usersService = new UsersService();
    const errorMessage = new UserMessage();

    const userExist = await usersService.findUserByEmail(data.email);

    if (!!userExist) {
      errorMessage.success = false;
      errorMessage.message = "L'utilisateur existe déjà";
      return errorMessage;
    }

    const user = await usersService.create(data);

    const successMessage = new UserMessage();
    successMessage.success = true;
    successMessage.message = "Bienvenue !";

    return successMessage;
  }

  @Mutation(() => UserEntity)
  async updateUser(@Arg("data") data: UpdateUserInputId) {
    const { id, ...body } = data;
    return await new UsersService().updateUser(id, body);
  }

  @Mutation(() => UserEntity)
  async archiveUser(@Arg("id") id: string) {
    return new UsersService().updateUser(id, { status: "ARCHIVED" });
  }
}
