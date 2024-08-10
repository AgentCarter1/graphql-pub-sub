import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Door extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isOpen: boolean;
}

export const DoorSchema = SchemaFactory.createForClass(Door);
