/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { PlayerTurn } from "./components/connect-4/player-turn";
export namespace Components {
    interface Connect4 {
        /**
          * The number of alignment to have to be the winner.
         */
        "alignmentTarget": number;
        /**
          * The number of column
         */
        "col": number;
        /**
          * Update board by putting a token of current play at given column
          * @param j the column
         */
        "currentPlayerPlayAt": (j: number) => Promise<void>;
        /**
          * The number of players
         */
        "maxPlayers": number;
        /**
          * The number of row
         */
        "row": number;
        /**
          * The number of token to align
         */
        "tokenTarget": number;
    }
}
declare global {
    interface HTMLConnect4Element extends Components.Connect4, HTMLStencilElement {
    }
    var HTMLConnect4Element: {
        prototype: HTMLConnect4Element;
        new (): HTMLConnect4Element;
    };
    interface HTMLElementTagNameMap {
        "connect-4": HTMLConnect4Element;
    }
}
declare namespace LocalJSX {
    interface Connect4 {
        /**
          * The number of alignment to have to be the winner.
         */
        "alignmentTarget"?: number;
        /**
          * The number of column
         */
        "col"?: number;
        /**
          * The number of players
         */
        "maxPlayers"?: number;
        "onAlignment"?: (event: CustomEvent<number>) => void;
        "onGameOver"?: (event: CustomEvent<number>) => void;
        "onPlayerTurn"?: (event: CustomEvent<PlayerTurn>) => void;
        /**
          * The number of row
         */
        "row"?: number;
        /**
          * The number of token to align
         */
        "tokenTarget"?: number;
    }
    interface IntrinsicElements {
        "connect-4": Connect4;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "connect-4": LocalJSX.Connect4 & JSXBase.HTMLAttributes<HTMLConnect4Element>;
        }
    }
}