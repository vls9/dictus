import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Entry } from "./Entry.js";
import { User } from "./User.js";

@ObjectType()
@Entity()
export class Pronunciation extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  transcription!: string;

  @Field()
  @Column()
  audioLink!: string;

  @Field()
  @Column()
  notes!: string;

  @Field(() => Int)
  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.pronunciations)
  user!: Relation<User>; // Must have a user

  @Field(() => Int)
  @Column()
  entryId!: number;

  @Field(() => Entry)
  @ManyToOne(() => Entry, (entry) => entry.pronunciations)
  entry!: Relation<Entry>; // Must have an entry

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
