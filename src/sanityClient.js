import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'y8hfnifa', // ganti dengan Project ID dari Sanity.io
  dataset: 'production',
  useCdn: true, // `false` kalau mau data real-time tanpa cache
  apiVersion: '2024-03-01',
});
