import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Meaning } from "./Meaning.js";
import { Pronunciation } from "./Pronunciation.js";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  headword!: string;

  @Field(() => [Pronunciation], { nullable: "itemsAndList" })
  @OneToMany(() => Pronunciation, (pronunciation) => pronunciation.entry, {
    nullable: true,
  })
  pronunciations: Relation<Pronunciation[]> | undefined;

  @Field(() => [Meaning], { nullable: "itemsAndList" })
  @ManyToMany(() => Meaning, (meaning) => meaning.entries, { nullable: true })
  meanings: Relation<Meaning[]> | undefined;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
