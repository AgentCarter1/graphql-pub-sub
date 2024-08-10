import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  private pubSub = new PubSub();

  async publish(eventName: string, payload: any) {
    await this.pubSub.publish(eventName, payload);
  }

  async asyncIterator(eventName: string) {
    return this.pubSub.asyncIterator(eventName);
  }
}
