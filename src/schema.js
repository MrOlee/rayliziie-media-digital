export default {
  name: 'post',
  title: 'Pusat Artikel Rayliziie Media',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul Artikel',
      type: 'string',
      description: 'Masukkan judul berita atau artikel yang menarik.',
    },
    {
      name: 'category',
      title: 'Kategori Media',
      type: 'string',
      options: {
        list: [
          { title: 'NutrisiDietMu (Gizi & Kesehatan)', value: 'gizi' },
          { title: 'BolaGass (Sepak Bola)', value: 'bola' },
          { title: 'GlowLogika (Skincare & Kecantikan)', value: 'skincare' },
          { title: 'CuanPintar (Finansial & Investasi)', value: 'keuangan' }
        ],
        layout: 'radio'
      },
      description: 'Pilih ke website anak media mana artikel ini akan diterbitkan.'
    },
    {
      name: 'mainImage',
      title: 'Foto / Cover Artikel',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'publishedAt',
      title: 'Tanggal Tayang',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Isi Konten Artikel',
      type: 'text',
      description: 'Ketik tulisan atau berita lengkap lu di sini, Boy.'
    },
  ],
}
