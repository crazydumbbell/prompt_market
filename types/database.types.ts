export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  prompt_text: string;
  image_urls: string[];
  thumbnail_url: string | null;
  category: string;
  is_active: boolean;
}

export interface Cart {
  id: number;
  created_at: string;
  user_id: string;
  prompt_id: string;
  prompts?: Prompt;
}

export interface Purchase {
  id: string;
  created_at: string;
  buyer_id: string;
  prompt_id: string;
  payment_order_id: string;
  payment_amount: number;
  payment_status: string;
  prompts?: Prompt;
}

