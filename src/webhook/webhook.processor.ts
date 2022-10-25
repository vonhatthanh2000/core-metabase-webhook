import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as dotenv from 'dotenv';
import { EWebhookEvents } from 'src/protobuf/interface-ts/enums';
dotenv.config();

const { NODE_ENV } = process.env;

@Processor(`${NODE_ENV + '_'}webhook`)
export class WebhookProcessor {
  @Process(EWebhookEvents.COLLECTION_CREATED)
  async createCollectionWebhook(job: Job) {
    console.log('1 :>> ', 1);
  }
}
