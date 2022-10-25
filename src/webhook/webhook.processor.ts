import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as dotenv from 'dotenv';
import { EWebhookEvents } from 'src/protobuf/interface-ts/enums';
dotenv.config();

const { NODE_ENV } = process.env;

@Processor(`${NODE_ENV + '_'}webhook`)
export class WebhookProcessor {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(WebhookProcessor.name);

  @Process(EWebhookEvents.COLLECTION_CREATED)
  async createCollectionWebhook(job: Job) {
    const collectionData = job.data.collection;
    const webhooks = job.data.webhooks;

    try {
      webhooks.map(
        async (webhook) => await this.httpService.post(webhook.url, collectionData, { timeout: 3000 }).toPromise(),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
