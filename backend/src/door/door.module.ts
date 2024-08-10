import { Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { DoorResolver } from './door.resolver';
import { PubSubService } from 'src/pubsub/pubsub.service';
import { Door, DoorSchema } from './door.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Door.name, schema: DoorSchema }]),
  ],
  providers: [DoorService, DoorResolver, PubSubService],
})
export class DoorModule {}
