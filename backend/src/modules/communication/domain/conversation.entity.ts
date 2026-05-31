import { MessageChannel } from './message.entity';

export interface ConversationProps {
  id: string;
  title?: string;
  channel: MessageChannel;
  externalId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Conversation {
  constructor(private readonly props: ConversationProps) {}

  get id(): string { return this.props.id; }
  get title(): string | undefined { return this.props.title; }
  get channel(): MessageChannel { return this.props.channel; }
  get externalId(): string | undefined { return this.props.externalId; }
  get userId(): string { return this.props.userId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}
