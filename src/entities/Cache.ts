import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class Cache extends BaseEntity {
  @PrimaryColumn({ type: "text" })
  key: string;

  @Column()
  value: string;
}
