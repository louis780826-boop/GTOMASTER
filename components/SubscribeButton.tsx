// components/SubscribeButton.tsx
'use client';

import { useState } from 'react';

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
      });
      if (!res.ok) {
        console.error('Checkout API error');
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-60"
    >
      {loading ? '前往結帳中…' : '升級 GTO Money PRO'}
    </button>
  );
}
