export interface CreatePollRequest {
  title: string
  type: "multiple_choice" | "image_poll" | "meeting" | "ranked_choice"
  media?: {
    id: string
    type: string
    source: string
    url: string
    width: number
    height: number
  }
  workspace?: {
    id: string
    name: string
    member_count: string
    poll_count: string
  }
  poll_options: Array<TextPollOption>
  poll_config?: {
    id_private?: boolean
    vote_type?: "default" | "box_small" | "participant_grid"
    allow_comments?: boolean
    allow_indeterminant?: boolean
    allow_other_options?: boolean
    custom_design_colors?: string
    deadline_at?: number
    allow_vpn_users?: boolean
    edit_vote_permissions?: "admin" | "admin_voter" | "voter" | "nobody"
    force_appearance?: "auto" | "dark" | "light"
    hide_participants?: boolean
    is_multiple_choice?: boolean
    multiple_choice_min?: number
    multiple_choice_max?: number
    number_of_winners?: number
    randomize_options?: boolean
    require_voter_names?: boolean
    results_visibility?: "always" | "after_deadline" | "after_vote" | "never"
    use_custom_design?: boolean
  }
  poll_meta?: {
    description: string
    location: string
    timezone?: string
  }
}

export interface TextPollOption {
  id?: string
  type: "text" | "image" | "date" | "time_range"
  value: string
  description?: string
  position?: number
  max_votes?: number
}
