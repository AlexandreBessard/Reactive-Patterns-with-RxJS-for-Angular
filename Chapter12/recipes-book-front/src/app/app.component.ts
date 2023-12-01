import { AfterViewInit, Component } from '@angular/core';
import { map } from 'rxjs';
import { RealTimeService } from './core/services/real-time.service';
import {catchError, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  //declare the messages$ observable
  //messages$ = this.service.messages$.pipe(map(rows => rows.message));

  liveData$ = this.service.messages$.pipe(
    map(rows => rows.message),
    catchError(error => { throw error }),
    tap({
      error: error => console.log('[Live component] Error:', error),
      complete: () => console.log('[Live component] Connection Closed')
    })
  );


  constructor(private service: RealTimeService) {
    //connect to the WS
    this.service.connect();
    this.service.sendMessage({key: "1", message: "messageTEST"});
  }

  ngOnInit(): void {
    // Subscribe to liveData$ and handle messages
    this.liveData$.subscribe(
      message => console.log('[Live component] Received Message:', message),
      error => console.error('[Live component] Error in liveData$ observable:', error),
      () => console.log('[Live component] liveData$ observable completed')
    );
  }
}
