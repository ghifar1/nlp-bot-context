
type QuestionArray = {
    language: string,
    question: string,
    className: string
}

type ResponseArray<T> = {
    language: string,
    className: string,
    callback: (param: T) => void
}

type Identifier = {
    id: string,
    state: string,
    needAnswer: boolean,
}