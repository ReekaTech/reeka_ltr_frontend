import AddPropertyFormClient from './AddPropertyFormClient';
import { Suspense } from 'react';

export default function AddPropertyForm() {
  return (
    <Suspense fallback={<div>Loading property form…</div>}>
      <AddPropertyFormClient />
    </Suspense>
  );
}
