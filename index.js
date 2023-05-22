"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NlpContext = void 0;
var NLP = require("node-nlp");
var NlpContext = /** @class */ (function () {
    function NlpContext(dataConstruct) {
        this.nlp = new NLP.NlpManager({ languages: ['en'] });
        this.questionArray = [];
        this.responseArray = [];
        this.identifierArray = [];
    }
    /**
    * Add a question to the NLP context
    *
    * @param language The language of the question
    * @param question The question to be added
    * @param className The class name of the question
    * @returns void
    */
    NlpContext.prototype.addInput = function (language, question, className) {
        this.questionArray.push({ language: language, question: question, className: className });
    };
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
    NlpContext.prototype.addResponse = function (language, className, callback) {
        this.responseArray.push({ language: language, className: className, callback: callback });
    };
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
    NlpContext.prototype.addResponses = function (responses) {
        var _this = this;
        responses.forEach(function (response) {
            _this.addResponse(response.language, response.className, response.callback);
        });
    };
    /**
     * Initialize document and train the NLP
     *
     * @returns void
     */
    NlpContext.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.questionArray.forEach(function (question) {
                            _this.nlp.addDocument(question.language, question.question, question.className);
                        });
                        return [4 /*yield*/, this.nlp.train()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process an input
     *
     * @param language The language of the input
     * @param identifier The identifier of the input
     * @param question The question to be processed
     * @param data The data to be passed to the callback
     * @returns void
     */
    NlpContext.prototype.process = function (language, identifier, question, data) {
        return __awaiter(this, void 0, void 0, function () {
            var process, className, response, identifierIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nlp.process(language, question)
                        // get the intent
                    ];
                    case 1:
                        process = _a.sent();
                        className = process.intent;
                        response = this.responseArray.find(function (response) { return response.className === className; });
                        if (!response)
                            return [2 /*return*/];
                        identifierIndex = this.identifierArray.find(function (identifierObject) { return identifierObject.id === identifier; });
                        // if the identifier is not found, we create a new one
                        if (!identifierIndex) {
                            this.identifierArray.push({
                                id: identifier,
                                state: className,
                                needAnswer: false
                            });
                        }
                        else {
                            // if the identifier is found and don't need answer, we can change the state
                            if (!identifierIndex.needAnswer) {
                                identifierIndex.state = className;
                            }
                        }
                        return [2 /*return*/, response.callback(data)];
                }
            });
        });
    };
    /**
     * Change the state of an identifier
     *
     * @param identifier The identifier to be changed
     * @param state The new state
     * @param needAnswer If the identifier need answer
     * @returns void
     */
    NlpContext.prototype.changeState = function (identifier, state, needAnswer) {
        if (needAnswer === void 0) { needAnswer = false; }
        var identifierIndex = this.identifierArray.find(function (identifierObject) { return identifierObject.id === identifier; });
        if (!identifierIndex)
            return;
        identifierIndex.state = state;
        identifierIndex.needAnswer = needAnswer;
    };
    return NlpContext;
}());
exports.NlpContext = NlpContext;
