import { Field, InputType } from "type-graphql";

@InputType()
export class CredentialOptions {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field()
  email?: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
