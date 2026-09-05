import { useState } from 'react'

// 物件の新規登録・編集で共通利用するフォーム
export function PropertyForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name, rent: Number(rent), area, layout })
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label htmlFor="property-name">物件名</label>
      <input
        id="property-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="property-rent">家賃（円）</label>
      <input
        id="property-rent"
        type="number"
        min="0"
        value={rent}
        onChange={(event) => setRent(event.target.value)}
        required
      />

      <label htmlFor="property-area">エリア</label>
      <input
        id="property-area"
        value={area}
        onChange={(event) => setArea(event.target.value)}
        required
      />

      <label htmlFor="property-layout">間取り</label>
      <input
        id="property-layout"
        placeholder="例：1LDK"
        value={layout}
        onChange={(event) => setLayout(event.target.value)}
        required
      />

      <div className="property-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : '保存'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
