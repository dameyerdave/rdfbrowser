const prefix = (query: string, response: string) => {
  const iri_prefix_hash: {[key: string]: string} = {}
  for (const line of query.split('\n')) {
    if (line.trim().startsWith('PREFIX')) {
      const match = /PREFIX ([^:]+): <([^>]+)>/.exec(line)
      if (match) {
        const iri = match[2]
        iri_prefix_hash[iri] = match[1]
      }
    }
  }
  if (Object.keys(iri_prefix_hash).length > 0) {
    for (const [iri, prefix] of Object.entries(iri_prefix_hash)) {
      response = response.replaceAll(iri, `${prefix}:`)
    }
  }
  return response
}

export {prefix}
