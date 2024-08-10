import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { DoorService } from './door.service';
import { Door } from './door.model';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Door)
export class DoorResolver {
  constructor(private readonly doorService: DoorService) {}

  @Query(() => [Door])
  async getAllDoors(): Promise<Door[]> {
    return this.doorService.getDoors();
  }

  @Mutation(() => Door)
  async addDoor(@Args('name') name: string): Promise<Door> {
    const door = await this.doorService.addDoor(name);
    await pubSub.publish('doorAdded', { doorAdded: door });
    return door;
  }

  @Mutation(() => Door)
  async openDoor(@Args('id') id: string): Promise<Door> {
    const door = await this.doorService.openDoor(id);
    await pubSub.publish('doorOpened', { doorOpened: door });

    setTimeout(async () => {
      await pubSub.publish('doorClosed', { doorClosed: door });
    }, 2000);

    return door;
  }

  @Subscription(() => Door)
  doorAdded() {
    return pubSub.asyncIterator('doorAdded');
  }

  @Subscription(() => Door)
  doorOpened() {
    return pubSub.asyncIterator('doorOpened');
  }

  @Subscription(() => Door)
  doorClosed() {
    return pubSub.asyncIterator('doorClosed');
  }
}
