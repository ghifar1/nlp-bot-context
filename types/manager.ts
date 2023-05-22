type ProcessResponse = {
    utterance: string,
    locale: string,
    languageGuessed: boolean,
    localeIso2: string,
    language: string,
    domain: string,
    classifications: Array<{ "label": string, "value": number }>,
    intent: string,
    score: number,
    entities: Array<{ "start": number, "end": number, "len": number, "accuracy": number, "sourceText": string, "utteranceText": string, "entity": string, "resolution": Array<Object> }>,
    sentiment: { score: number, comparative: number, vote: string, numWords: number, numHits: number, type: string, language: string },
    actions: [],
    srcAnswer: string,
    answer: string
}

interface NlpManager {
    addDocument(language: string, question: string, className: string): void
    addAnswer(language: string, className: string, response: string): void
    process(language: string, question: string): Promise<ProcessResponse>
    train(): Promise<void>
}

export {
    NlpManager
}