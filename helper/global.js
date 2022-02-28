module.exports = {
    codeGenerator: async function(length){
        randomresult           = '';
        randomcharacters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        randomcharactersLength = randomcharacters.length;
    
        for ( var i = 0; i < length; i++ ) {
           randomresult += randomcharacters.charAt(Math.floor(Math.random() * randomcharactersLength));
        }

        return randomresult
    },
    dateConverter: async function(date){
        const year = date.substring(0,4)
        const month = date.substring(5,7)
        const day = date.substring(8,10)
        const time = date.substring(11,19)
        const fulldate = `${day}.${month}.${year}`

        return {
            day: day,
            month: month,
            year: year,
            time: time,
            date: fulldate
        }
    }
}