import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Door } from './door.model';

@Injectable()
export class DoorService {
  constructor(@InjectModel(Door.name) private doorModel: Model<Door>) {}

  async addDoor(name: string): Promise<Door> {
    const newDoor = new this.doorModel({ name });
    return newDoor.save();
  }

  async openDoor(id: string): Promise<Door> {
    const door = await this.doorModel.findById(id).exec();
    if (!door) {
      throw new Error('Door not found');
    }
    door.isOpen = true;
    await door.save();

    setTimeout(async () => {
      door.isOpen = false;
      await door.save();
      console.log(`Door ${door.name} automatically closed.`);
    }, 2000);

    return door;
  }

  async getDoors(): Promise<Door[]> {
    return this.doorModel.find().exec();
  }
}
