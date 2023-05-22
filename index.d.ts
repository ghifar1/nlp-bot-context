import { Identifier, QuestionArray, ResponseArray } from "./types/NlpContextMember";
import { NlpManager } from "./types/manager";
export declare class NlpContext<T> {
    nlp: NlpManager;
    questionArray: Array<QuestionArray>;
    responseArray: Array<ResponseArray<T>>;
    identifierArray: Array<Identifier>;
    constructor(dataConstruct: T);
    /**
    * Add a question to the NLP context
    *
    * @param language The language of the question
    * @param question The question to be added
    * @param className The class name of the question
    * @returns void
    */
    addInput(language: string, question: string, className: string): void;
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
    addResponse(language: string, className: string, callback: (param: T) => void): void;
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
    addResponses(responses: Array<ResponseArray<T>>): void;
    /**
     * Initialize document and train the NLP
     *
     * @returns void
     */
    init(): Promise<void>;
    /**
     * Process an input
     *
     * @param language The language of the input
     * @param identifier The identifier of the input
     * @param question The question to be processed
     * @param data The data to be passed to the callback
     * @returns void
     */
    process(language: string, identifier: string, question: string, data: T): Promise<void>;
    /**
     * Change the state of an identifier
     *
     * @param identifier The identifier to be changed
     * @param state The new state
     * @param needAnswer If the identifier need answer
     * @returns void
     */
    changeState(identifier: string, state: string, needAnswer?: boolean): void;
}
