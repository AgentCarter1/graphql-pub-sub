import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Door {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  isOpen?: boolean;
}
