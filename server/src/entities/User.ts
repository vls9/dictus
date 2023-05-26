import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Meaning } from "./Meaning.js";
import { Pronunciation } from "./Pronunciation.js";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => Meaning, (meaning) => meaning.user, {
    nullable: true,
  })
  meanings: Relation<Meaning[]> | undefined;

  @OneToMany(() => Pronunciation, (pronunciation) => pronunciation.user, {
    nullable: true,
  })
  pronunciations: Relation<Pronunciation[]> | undefined;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}