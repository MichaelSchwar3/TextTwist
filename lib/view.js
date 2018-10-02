import {level1, level2, level3} from './dictionary.js';
import {shuffle, formatTime} from './util.js';

class View {
  constructor(game) {
    this.game = game;
    this.levels = this.levelOrder();
    this.levelCounter = 0;
    this.board = $('#board-list');
    this.pos = 0;
    this.guessPos = [];
    this.words = this.levels[this.levelCounter];
    this.remainingWords = this.words.length;
    this.addListeners = this.addListeners.bind(this);
    this.newRound = this.newRound.bind(this);
    this.setLetters = this.setLetters.bind(this);
    this.board = this.makeBoard();
    this.setLetters();
  }
  levelOrder() {
    let levels = [level1,level2,level3];
    return shuffle(levels);
  }
  setLetters(){
    this.let0 = $(`.let-0`);
    this.let1 = $(`.let-1`);
    this.let2 = $(`.let-2`);
    this.let3 = $(`.let-3`);
    this.let4 = $(`.let-4`);
    this.let5 = $(`.let-5`);
    this.letters = {
      [this.let0.html().toLowerCase()] : 0,
      [this.let1.html().toLowerCase()] : 1,
      [this.let2.html().toLowerCase()] : 2,
      [this.let3.html().toLowerCase()] : 3,
      [this.let4.html().toLowerCase()] : 4,
      [this.let5.html().toLowerCase()] : 5,
    };
  }
  newRound(newGame = true) {
    if (newGame) {
      this.levelCounter = 0;
      this.game.round = 1;
      this.levels = this.levelOrder();
    }
    const level = Object.values(this.words).reverse();
    this.lastWord = level[0];
    let wordArr = shuffle(this.lastWord.split(""));
    let pos = 0;
    while(pos<6){
      $(`.let-${pos}`).html(`${wordArr[0]}`);
      wordArr = wordArr.slice(1);
      pos += 1;
    }
    this.levelCounter+=1;
    this.keepTime();
  }
  makeBoard() {
    const level = Object.values(this.words);
    let currentWord = "";
    for (let i = 0; i < level.length; i++) {
      this.board.append(
        `<li class="word"><ul id="word-${i}"></ul></li>`
      );
      currentWord = level[i].split("");
      for (let j = 0; j < currentWord.length; j++) {
        $(`#word-${i}`).append(
        `<li class="letter"><span class="hidden-letter ${level[i]}">${currentWord[j]}</span></li>`
      );
      }
    }
    this.newRound();
    this.addListeners();
  }
  keepTime() {
    this.timer = 120;
      setInterval(()=>{
        if(this.timer >-1){
          $('#timer-time').html(`${formatTime(this.timer--)}`);
          this.timer;
        }
      }, 1000);
  }
  guess() {
    const guessArr = this.guessPos.reverse();
    let guessString = "";
    for (let i = 0; i < guessArr.length; i++) {
      guessString += $(`.let-${guessArr[i]}`).html();
    }
    this.clear(this.guessPos);
    this.revealWord(guessString);
  }
  revealWord(word) {
    if(this.words[word.toLowerCase()]){
      $(`.${word}`).removeClass("hidden-letter");
      this.game.addScore(word.length);
      this.remainingWords--;
      debugger
      delete this.words[word.toLowerCase()];
      debugger
    }
  }
  shuffleLetters() {
    let shuffleArr = shuffle([0,1,2,3,4,5]);
    let letters = [];
    let classes = "";
    for (let i = 0; i < shuffleArr.length; i++) {
      letters.push($(`.let-${i}`));
    }
    for (let i = 0; i < letters.length; i++) {
      letters[i].removeClass(`let-${i}`);
      classes = letters[i].attr('class');
      classes = `let-${shuffleArr[i]} ${classes}`;
      letters[i].attr('class', classes);
    }
  }
  clear() {
    for (let i = 0; i < this.guessPos.length; i++) {
      $(`.let-${this.guessPos[i]}`).removeClass(`guess-${i} guessed`);
    }
  }
  addListeners() {
    document.addEventListener('keydown', (event)=>{
      if (this.letters[event.key] !== undefined) {
        if (!$(`.let-${this.letters[event.key]}`).hasClass("guessed")) {
          $(`.let-${this.letters[event.key]}`).addClass(`guess-${this.pos} guessed`);
          this.guessPos.unshift(this.letters[event.key]);
          this.pos+=1;
        }
      }else if (event.keyCode === 46 || event.keyCode === 8) {
          this.pos -= 1;
          if (this.pos <= 0) this.pos = 0;
          $(`.let-${this.guessPos[0]}`).removeClass(`guess-${this.pos} guessed`);
          this.guessPos.shift();
      }else if (event.keyCode === 13) {
        this.guess();
        this.guessPos = [];
        this.pos = 0;
      }else if(event.keyCode === 32) {
        this.guess();
        this.guessPos = [];
        this.pos = 0;
        this.shuffleLetters();
        this.setLetters();
      }else {
          console.log(event.keyCode);
          console.log(event.key);
          console.log($(`.let-${this.pos}`).innerHTML);
      }
    }
  );
  $("#twist").on("click", this.shuffleLetters);

  }
}

export default View;