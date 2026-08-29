export type AsteroidsAction = 'left' | 'right' | 'thrust' | 'fire' | 'hyperspace'

const KEY_TO_ACTION: Record<string, AsteroidsAction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'thrust',
  ' ': 'fire', // event.key for the space bar
  Control: 'hyperspace'
}

export function actionForKey(key: string): AsteroidsAction | null {
  return KEY_TO_ACTION[key] ?? null
}
