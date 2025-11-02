import React from 'react'

export default function App() {
  const [amount, setAmount] = React.useState('5000')
  return (
    <main style={{padding:'40px 16px',maxWidth:720,margin:'0 auto',fontFamily:'ui-sans-serif,system-ui'}}>
      <h1 style={{margin:'0 0 12px'}}>Fiat ⇄ Crypto Converter</h1>
      <p style={{opacity:.7,margin:'0 0 20px'}}>最小構成（ここから機能を積み上げます）</p>
      <label>金額</label>
      <input value={amount} onChange={e=>setAmount(e.target.value)} style={{display:'block',padding:'10px',borderRadius:8,border:'1px solid #ddd'}} />
      <div style={{marginTop:16}}>結果: —</div>
    </main>
  )
}

