
module.exports = {
    once: false,
    name: "error",

    execute(client, error){
        console.log('[Event - Error] | Unhandled error detected')
        console.log(error);
    }
}