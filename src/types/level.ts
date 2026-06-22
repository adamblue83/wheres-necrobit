export interface Target {
  id: string
  type: 'character' | 'difference' | 'hidden'
  label: string
  x: number  // percentage 0-100
  y: number  // percentage 0-100
  radius: number  // percentage of image width
}

export interface Level {
  id: string
  title: string
  world: string
  image: string
  targets: Target[]
}
