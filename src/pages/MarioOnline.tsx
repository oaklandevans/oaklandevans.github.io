import React from 'react';

export default function MarioOnline() {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <iframe
        src="/Mario_Online/MarioOnline.html"
        width="1020"
        height="550"
        style={{ border: 'none' }}
        title="Mario Online Game"
      />
    </div>
  );
}
