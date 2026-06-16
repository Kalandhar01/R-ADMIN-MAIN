import { EventEmitter } from "node:events";

const consultationEvents = new EventEmitter();
consultationEvents.setMaxListeners(500);

function eventName(consultationId: string): string {
  return `consultation:${consultationId}`;
}

export function publishConsultationUpdate(consultationId: string): void {
  consultationEvents.emit(eventName(consultationId));
}

export function subscribeConsultationUpdate(consultationId: string, listener: () => void): () => void {
  const name = eventName(consultationId);
  consultationEvents.on(name, listener);

  return () => {
    consultationEvents.off(name, listener);
  };
}
