import { Field, InputType } from "type-graphql";

@InputType()
export class PostOptions {
  @Field()
  title: string;

  @Field()
  text: string;
}
