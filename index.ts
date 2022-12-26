import * as NLP from "node-nlp"

class NlpContext<T> {
    nlp: NlpManager
    questionArray: Array<QuestionArray>
    responseArray: Array<ResponseArray<T>>
    identifierArray: Array<Identifier>

    constructor(dataConstruct: T) {
        this.nlp = new NLP.NlpManager({ languages: ['en'] })
        this.questionArray = []
        this.responseArray = []
        this.identifierArray = []
    }

    /**  
    * Add a question to the NLP context    
    *
    * @param language The language of the question
    * @param question The question to be added
    * @param className The class name of the question
    * @returns void
    */
    addInput(language: string, question: string, className: string): void {
        this.questionArray.push({ language, question, className })
    }

    /**
     * Add a response to the NLP context
     *
     * @param language The language of the response
     * @param className The class name of the response
     * @param callback The callback to be executed
     * @returns void
     * @memberof NlpContext
     * @template T
     * @param data The data to be passed to the callback
     * @returns void
     */
    addResponse(language: string, className: string, callback: (param: T) => void): void {
        this.responseArray.push({ language, className, callback })
    }

    /**
     * Add multiple responses to the NLP context
     * 
     * @param responses The responses to be added
     * @returns void
     * @memberof NlpContext
     * @template T
     * @param data The data to be passed to the callback
     * @returns void
     */
    addResponses(responses: Array<ResponseArray<T>>) {
        responses.forEach(response => {
            this.addResponse(response.language, response.className, response.callback)
        })
    }

    /**
     * Initialize document and train the NLP
     * 
     * @returns void
     */
    async init() {
        this.questionArray.forEach(question => {
            this.nlp.addDocument(question.language, question.question, question.className)
        })
        await this.nlp.train()
    }

    /**
     * Process an input
     * 
     * @param language The language of the input
     * @param identifier The identifier of the input
     * @param question The question to be processed
     * @param data The data to be passed to the callback
     * @returns void
     */
    async process(language: string, identifier: string, question: string, data: T) {

        // let nlp choose intent (or we call className)
        const process = await this.nlp.process(language, question)

        // get the intent
        const className = process.intent
        const response = this.responseArray.find(response => response.className === className)
        if (!response) return

        // first, we need find the identifier
        const identifierIndex = this.identifierArray.find(identifierObject => identifierObject.id === identifier)

        // if the identifier is not found, we create a new one
        if (!identifierIndex) {
            this.identifierArray.push({
                id: identifier,
                state: className,
                needAnswer: false
            })
        } else {
            // if the identifier is found and don't need answer, we can change the state
            if (!identifierIndex.needAnswer) {
                identifierIndex.state = className
            }
        }

        return response.callback(data)
    }

    /**
     * Change the state of an identifier
     * 
     * @param identifier The identifier to be changed
     * @param state The new state
     * @param needAnswer If the identifier need answer
     * @returns void
     */
    changeState(identifier: string, state: string, needAnswer: boolean = false) {
        const identifierIndex = this.identifierArray.find(identifierObject => identifierObject.id === identifier)
        if (!identifierIndex) return
        identifierIndex.state = state
        identifierIndex.needAnswer = needAnswer
    }
}


async function wow() {
    const test = new NlpContext({
        id: "",
        message: ""
    })

    test.addInput('en', 'good morning!', 'greetings.morning')
    test.addInput('en', 'morning', 'greetings.morning')
    test.addInput('en', 'good afternoon!', 'greetings.afternoon')
    test.addInput('en', 'afternoon', 'greetings.afternoon')

    test.addResponse('en', 'greetings.morning', ({ id, message }) => {
        console.log("YOU DID IT ", message)
    })


    await test.init()
    await test.process('en', 'go', 'morning', { id: "", message: "hello" })
}

wow()