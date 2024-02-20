import type { Score } from "./Score"

export type Player = {
    name: string,
    previousRank?: number,
    rank: number,
    totalPoints: number,
    score?: Score
}
