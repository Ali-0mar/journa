const EntryCard = ({ entry }: any) => {
  const date = new Date(entry.createdAt).toDateString()
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{date}</div>
      <div className="px-4 py-5 sm:p-6">Subject: {entry.analysis.subject}</div>
      <div className="px-4 py-5 sm:p-6">{entry.analysis.summary}</div>
      <div className="px-4 py-5 sm:p-6">
        {entry.analysis.keywords
          .split(',')
          .map((keyword: string, index: number) => (
            <>
              <span key={`${keyword}-${index}`}>{keyword}</span>
              {index === entry.analysis.keywords.split(',').length - 1 ? (
                <span>.</span>
              ) : (
                <span>|</span>
              )}
            </>
          ))}
      </div>
    </div>
  )
}

export default EntryCard
