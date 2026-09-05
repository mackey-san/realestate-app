import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PropertyForm } from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/properties'

// 家賃を「¥XX,XXX」形式で表示するためのフォーマッタ
const rentFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
})

// 物件一覧画面（Supabaseから自分が登録した物件を取得しCRUD操作を行う）
export function PropertyListPage() {
  const { user, signOut } = useAuth()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // フォームの表示モード：null（非表示）/ 'create'（新規登録）/ 'edit'（編集）
  const [formMode, setFormMode] = useState(null)
  const [editingProperty, setEditingProperty] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // 物件一覧をSupabaseから取得する
  const loadProperties = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch (error) {
      setErrorMessage('物件情報の取得に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleStartCreate = () => {
    setEditingProperty(null)
    setFormMode('create')
  }

  const handleStartEdit = (property) => {
    setEditingProperty(property)
    setFormMode('edit')
  }

  const handleCancelForm = () => {
    setFormMode(null)
    setEditingProperty(null)
  }

  // 新規登録・編集フォームの送信処理
  const handleSubmit = async (values) => {
    setSubmitting(true)
    setErrorMessage('')
    try {
      if (formMode === 'edit' && editingProperty) {
        await updateProperty(editingProperty.id, values)
      } else {
        await createProperty(values)
      }
      await loadProperties()
      setFormMode(null)
      setEditingProperty(null)
    } catch (error) {
      setErrorMessage('物件情報の保存に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  // 物件の削除処理（確認ダイアログを表示してから実行）
  const handleDelete = async (property) => {
    const confirmed = window.confirm(`「${property.name}」を削除しますか？`)
    if (!confirmed) return

    setErrorMessage('')
    try {
      await deleteProperty(property.id)
      await loadProperties()
    } catch (error) {
      setErrorMessage('物件の削除に失敗しました。')
    }
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-as">{user?.email} でログイン中</p>
        </div>
        <button type="button" onClick={() => signOut()}>
          ログアウト
        </button>
      </header>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {formMode ? (
        <div className="property-form-panel">
          <h2>{formMode === 'edit' ? '物件を編集' : '物件を新規登録'}</h2>
          <PropertyForm
            initialValues={editingProperty}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            submitting={submitting}
          />
        </div>
      ) : (
        <button type="button" className="new-property-button" onClick={handleStartCreate}>
          ＋ 新規物件を登録
        </button>
      )}

      {loading ? (
        <p className="loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p>登録されている物件はありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p className="property-rent">{rentFormatter.format(property.rent)} / 月</p>
              <p className="property-area">
                {property.area}（{property.layout}）
              </p>
              <div className="property-card-actions">
                <button type="button" onClick={() => handleStartEdit(property)}>
                  編集
                </button>
                <button type="button" onClick={() => handleDelete(property)}>
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
