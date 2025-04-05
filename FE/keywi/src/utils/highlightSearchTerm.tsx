export default function highlightSearchTerm(name: string, keyword: string) {
  if (!keyword) return name

  const parts = name.split(new RegExp(`(${keyword})`, 'gi'))
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <strong key={index}>{part}</strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}
