import { Component, Prop, State, Method, h, Event, EventEmitter, Listen } from '@stencil/core';
import {PlayerTurn} from './player-turn';

/**
 * Board game called "connect 4" in English
 * or "puissance 4" in French.
 * 
 * Goal is to align 4 tokens in row, column, or diagonal.
 * 
 * Here we generalized it.
 */
@Component({
  tag: 'connect-4',
  styleUrl: 'connect-4.css',
  shadow: true,
})
export class Connect4 {
  /**
   * The number of column
   */
  @Prop() col: number = 8;

  /**
   * The number of row
   */
  @Prop() row: number = 6;

  /**
   * The number of players
   */
  @Prop() maxPlayers: number = 2;

  /**
   * The number of token to align
   */
  @Prop() tokenTarget: number = 4;

  /**
   * The number of alignment to have to be the winner.
   */
  @Prop() alignmentTarget: number = 1;

  /**
   * The current board state.
   * 
   * NB: indices are column first, row second
   */
  @State() board: Array<Array<number>> = undefined;

  /**
   * Next player turn
   */
  @State() currentPlayer: number = 0;

  @Event() playerTurn: EventEmitter<PlayerTurn>;

  @Event() alignment: EventEmitter<number>;
  @Event() gameOver: EventEmitter<number>;
  
  componentWillLoad() {
    if (this.board === undefined) {
      this.board = [];
      for (let j = 0; j < this.col; j++) {
        let currentCol = [];
        for (let i = 0; i < this.row; i++) {
          currentCol[i] = undefined;
        }
        this.board[j] = currentCol;
      }
    }
  }

  /**
   * Update board by putting a token of current play at given column
   * @param j the column
   */
  @Method()
  async currentPlayerPlayAt(j: number) {
    //console.log("Play " + (this.currentPlayer) + " played at " + j);
    let i : number = 0;
    let theCol = this.board[j];
    for (i = 0; i < this.row; i++) {
      if (theCol[i] !== undefined) {
        break;
      }
    }
    i--;
    if (i < 0) {
      console.log("Illegal move");
      return;
    }
    theCol[i] = this.currentPlayer;
    this.board[j] = theCol;
    this.board = [...this.board];
    let playerTurnData = new PlayerTurn();
    playerTurnData.column = j;
    playerTurnData.player = this.currentPlayer;
    this.currentPlayer = (this.currentPlayer + 1) % this.maxPlayers;
    this.playerTurn.emit(playerTurnData);
    this.checkGameEnd(playerTurnData.player, i, j);
  }

  private checkGameEnd(player: number, i: number, j: number) {
    let didWin : boolean = false;
    // Reminder: the token at (i,j) is counted twice.
    let count = this.didWin(player, i, j, -1, 0) + this.didWin(player, i, j, 1, 0);
    didWin = didWin || (count > this.tokenTarget);
    count = this.didWin(player, i, j, -1, -1) + this.didWin(player, i, j, 1, 1);
    didWin = didWin || (count > this.tokenTarget);
    count = this.didWin(player, i, j, 0, -1) + this.didWin(player, i, j, 0, 1);
    didWin = didWin || (count > this.tokenTarget);
    count = this.didWin(player, i, j, -1, 1) + this.didWin(player, i, j, 1, -1);
    didWin = didWin || (count > this.tokenTarget);

    if (didWin) {
      this.alignment.emit(player);
      //TODO count alignment per player
      if (this.alignmentTarget == 1) {
        this.gameOver.emit(player);
      }
    }
  }

  private didWin(player: number, iStart: number, jStart: number, deltaRow: number, deltaCol: number) {
    let i = iStart;
    let j = jStart;
    let count = 0;
    for(count=0; count < this.tokenTarget; count++) {
      if (i < 0 || i >= this.row) {
        return count;
      }
      if (j < 0 || j >= this.col) {
        return count;
      }
      if (this.board[j][i] != player) {
        return count;
      }
      j += deltaCol;
      i += deltaRow;
    }
    return count;
  }

  private getCSSClassFor(i: number, j: number) {
    let classes = 'token-place';
    let tokenij = this.board[j][i];
    if (tokenij === undefined) {
      return classes;
    } else {
      return classes + ' player' + tokenij;
    }
  }

  private isColumnFull(j: number) {
    return this.board[j][0] !== undefined;
  }

  render() {
    const rows = [];
    const cols = [];
    for (let j=0; j < this.col; j++) {
      cols.push(<th><button type='button' disabled={this.isColumnFull(j)} onClick={() => this.currentPlayerPlayAt(j)}>{String.fromCodePoint(65+j)}</button></th>)
    }
    rows.push(<tr class='controls-row'>{cols}</tr>);
    
    for (let i = 0; i < this.row; i++) {
      const cols = [];
      for (let j=0; j < this.col; j++) {
        let actualStyle = this.getCSSClassFor(i,j);
        cols.push(<td class={actualStyle}>&nbsp;</td>)
      }
      rows.push(<tr>{cols}</tr>);
    }

    return <table>{rows}</table>
  }

  @Listen('gameOver')
  gameOverHandler(event: CustomEvent<number>) {
    console.log('gameOverHandler');
    for (let j=0; j < this.col; j++) {
      if (this.board[j][0] == undefined) {
        this.board[j][0] = event.detail;
      }
    }
  }
}