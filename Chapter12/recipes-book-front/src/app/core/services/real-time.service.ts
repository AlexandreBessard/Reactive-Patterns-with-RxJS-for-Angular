import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { Observable, timer, EMPTY, BehaviorSubject } from 'rxjs';
import { retryWhen, tap, delayWhen, switchAll, catchError } from 'rxjs/operators';
import { Message } from '../model/message.model';
export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {

  private socket$!: WebSocketSubject<Message> | undefined;

  private messagesSubject$ = new BehaviorSubject<Observable<Message>>(EMPTY);

  public messages$ = this.messagesSubject$
    .pipe(
      // Used to switch to the latest inner observable emitted by the source observable
      // ensure that only the values from the latest inner observable are considered
      switchAll(),
      catchError(e => { throw e })
    );

  // Create reference to the WebSocket Subject
  public getNewWebSocket(): WebSocketSubject<Message> {
    return webSocket({
      url: WS_ENDPOINT,
      closeObserver: {
        next: () => {
          console.log('[DataService]: connection closed');
          this.socket$ = undefined;
          this.connect({ reconnect: true });
        }
      },
    })
  }



  // sends a message given as input to the socket
  sendMessage(msg: Message) {
    this.socket$?.next(msg);
  }

  // Closes the connection
  close() {
    this.socket$?.complete();
  }

  // listen to the incoming messages in a reactive way
  // { reconnect: false } -> provide a default value for the cfg parameter, if no argument is passed, default object with reconnect is set to false
  public connect(cfg: { reconnect: boolean } = { reconnect: false }): void {

    if (!this.socket$ || this.socket$.closed) {
      console.log("Connecting...");
      // create reference to the WebSocket
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$
        .pipe(cfg.reconnect
          // returns an Observable<Message>
            ? this.reconnect
            : o => o,
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY));
      this.messagesSubject$.next(messages);
    }
  }



  private reconnect(observable: Observable<Message>): Observable<Message> {
    return observable
      .pipe(
        retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)),
      delayWhen(_ => timer(RECONNECT_INTERVAL)))));
  }


}
