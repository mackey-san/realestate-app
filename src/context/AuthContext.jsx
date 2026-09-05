import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 認証状態（ログインユーザー情報）をアプリ全体で共有するためのContext
const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 初回のセッション取得が終わるまでのローディング状態
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 現在のログインセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // ログイン・ログアウトなどの認証状態の変化を監視する
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    // メールアドレス＋パスワードでログイン
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    // メールアドレス＋パスワードで会員登録
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    // ログアウト
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 認証情報を利用するためのカスタムフック
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthはAuthProviderの内側で使用してください')
  }
  return context
}
