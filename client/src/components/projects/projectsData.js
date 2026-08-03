export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80';

export const toProjectCards = (rawProjects = []) =>
  rawProjects.map((p) => ({
    id: p._id,
    category: p.category || 'General',
    title: p.name || 'Untitled Project',
    description: p.description || '',
    image: p.coverImage || FALLBACK_IMG,
    link: `/projects/${p.slug || p._id}`,
    year: p.year || null,
    location: p.location || '',
  }));
