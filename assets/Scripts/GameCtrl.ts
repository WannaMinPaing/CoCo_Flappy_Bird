import { _decorator, CCInteger, Component, Node , input, Input, EventKeyboard, KeyCode, director} from 'cc';
import { Ground } from './Ground';
import { Results } from './Results';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {

   @property({
        type: Ground,
        tooltip: 'this is ground'
    })
   public ground: Ground;

   @property({
        type: Results,
        tooltip: 'results go here'
    })
   public results: Results;

   @property({
        type: CCInteger,
   })
   public speed: number = 300;

   @property({
        type: CCInteger,

   })
   public pipeSpeed : number = 200;

   onLoad() {
          this.initListener();
          this.results.resetScore();
          director.pause();
   }

   initListener(){
     input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this)
   }


   // Testing method, Delete me final version
   onKeyDown(event:EventKeyboard){
          switch (event.keyCode) {
               case KeyCode.KEY_A:
                    this.gameOver()        
               break;
               case KeyCode.KEY_P:
                    this.results.addScore();       
               break;
               case KeyCode.KEY_Q:
                    this.resetGame();        
               break;
          }
     }

     startGame(){
          this.results.hideResults;
          director.resume();
     }

     gameOver(){
          this.results.showResults();
          director.pause();
     }

     resetGame(){
          this.results.resetScore();
          this.startGame
     }

}

