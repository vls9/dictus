import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Entry } from "./Entry.js";
import { User } from "./User.js";

@ObjectType()
@Entity()
export class Meaning extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  definition!: string;

  @Field()
  @Column()
  usage!: string;

  @Field()
  @Column()
  imageLink!: string;

  @Field()
  @Column()
  notes!: string;

  @Field(() => Int)
  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.meanings)
  user!: Relation<User> // Must have a user

  @Field(() => [Entry])
  @ManyToMany(() => Entry)
  @JoinTable()
  entries!: Relation<Entry[]> // Must have at least 1 entry

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
