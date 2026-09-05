import { useAuth } from '../context/AuthContext'
import { dummyProperties } from '../data/dummyProperties'

// 家賃を「¥XX,XXX」形式で表示するためのフォーマッタ
const rentFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
})

// 物件一覧画面（ダミーデータをカード形式で表示）
export function PropertyListPage() {
  const { user, signOut } = useAuth()

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

      <div className="property-grid">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">{rentFormatter.format(property.rent)} / 月</p>
            <p className="property-area">{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
