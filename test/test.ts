import {NlpContext} from ".."

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