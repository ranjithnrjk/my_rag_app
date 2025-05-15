export function combineDocuments(docs) {
    return docs
        .map((doc) => (typeof doc.pageContent === 'string' ? doc.pageContent : ''))
        .join('\n\n');
}