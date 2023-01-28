export const parseMarvelRes = (marvelRes) => ({
  code: marvelRes.code,
  attributionText: marvelRes.attributionText,
  data: {
    offset: marvelRes.data.offset,
    limit: marvelRes.data.limit,
    total: marvelRes.data.total,
    count: marvelRes.data.count,
    results: marvelRes.data.results.map(
      (r) => ({ id: r.id, name: r.name, description: r.description, image: `${r.thumbnail.path}.${r.thumbnail.extension}` })
    ),
  }
});
