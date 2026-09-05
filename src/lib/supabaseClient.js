import { createClient } from '@supabase/supabase-js'

// .envで管理しているSupabaseの接続情報を取得する
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabaseの接続情報が設定されていません。.envファイルを確認してください。'
  )
}

// アプリ全体で使い回すSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabaseKey)
