import type { Mario } from './sprites/Mario'

/** Interface that sprites use to access game state without circular dependency on GameModel */
export interface IGameModel {
  mario: Mario
}

