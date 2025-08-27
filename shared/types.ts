// 타입 정의
export interface Event {
  id: number;
  name: string;
  status: "team_selection" | "active" | "finished";
  duration_seconds: number;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
}

export interface Team {
  id: number;
  event_id: number;
  name: string;
  color: string;
  cheer_count: number;
  created_at: string;
}

export interface Participant {
  id: number;
  event_id: number;
  team_id: number;
  session_id: string;
  is_winner: boolean;
  joined_at: string;
}
