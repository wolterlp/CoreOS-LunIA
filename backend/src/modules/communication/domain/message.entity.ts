export enum MessageChannel {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM',
  SLACK = 'SLACK',
  TEAMS = 'TEAMS',
  SMS = 'SMS',
}

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export interface MessageProps {
  id: string;
  content: string;
  direction: MessageDirection;
  channel: MessageChannel;
  status: string;
  metadata?: Record<string, any>;
  conversationId: string;
  userId: string;
  sentAt: Date;
}

export class Message {
  constructor(private readonly props: MessageProps) {}

  get id(): string { return this.props.id; }
  get content(): string { return this.props.content; }
  get direction(): MessageDirection { return this.props.direction; }
  get channel(): MessageChannel { return this.props.channel; }
  get status(): string { return this.props.status; }
  get metadata(): Record<string, any> | undefined { return this.props.metadata; }
  get conversationId(): string { return this.props.conversationId; }
  get userId(): string { return this.props.userId; }
  get sentAt(): Date { return this.props.sentAt; }
}
