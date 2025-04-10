export function parseOpenGraph(description: string) {
  try {
    const ogData = JSON.parse(description)
    return {
      title: ogData['og:title'] || '제목 없음',
      description: ogData['og:description'] || '설명 없음',
      image: ogData['og:image'] || null,
      type: ogData['og:type'] || 'article',
    }
  } catch (error) {
    console.error('Failed to parse Open Graph data:', error)
    return null
  }
}
