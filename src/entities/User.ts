import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.creator, {
    onDelete: "CASCADE",
  })
  posts: Post[];

  @OneToMany(() => Updoot, (updoot) => updoot.user, {
    onDelete: "CASCADE",
  })
  updoots: Updoot[];
}
