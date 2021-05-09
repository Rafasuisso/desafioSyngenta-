import {promises as fs} from 'fs';
const { readFile, writeFile } = fs;

init()

async function init(){
    const file  = await readDateFile()
    const hotels = await readHotelsFile()
    const dates = file.split(/[\s,:]+/)
    const type = dates[0]
    dates.splice(0, 1)

    const hotel = findHotel(type, dates, hotels);
    
   await writeHotelFile(hotel)
}

function findHotel(type, dates, hotels){

    const mapDates = dates.map(date=>{
        if(date.includes("sat") || date.includes("sun")) return "weekend"
        else return "week"
    })

    var prices = []
    switch (type){
        case 'Regular':
            for(var i=0; i<hotels.length; i++){
                const totalCost = mapDates.reduce((accumulator, current) => {
                    if(current == 'week'){
                        return accumulator + hotels[i].weekRegularTax;
                    }else{
                        return accumulator + hotels[i].weekendRegularTax;
                    }
                  }, 0); 
                  console.log("total Cost: ", totalCost)
                  prices.push({name: hotels[i].name, cost: totalCost})
            }
            break;
        case 'Rewards':
            for(var i=0; i<hotels.length; i++){
                const totalCost = mapDates.reduce((accumulator, current) => {
                    if(current == 'week'){
                        return accumulator + hotels[i].weekRewardTax;
                    }else{
                        return accumulator + hotels[i].weekendRewardTax;
                    }
                  }, 0); 
                  prices.push({name: hotels[i].name, cost: totalCost})
            }
            break;
        default:
                console.log('Plano inválido');
    }

    const sortedPrices = prices.sort((a,b)=>{
        return a.cost - b.cost; 
    });

    const hotel = sortedPrices[0]
    return hotel.name
}

async function readDateFile(){
    try {
        const data = await readFile("teste3.txt", "utf-8");
        return data
    } catch (error) {
        return error
    }
}
async function readHotelsFile(){
    try {
        const data = JSON.parse(await readFile('./hotels.json'));
        return data
    } catch (error) {
        return error
    }
}

async function writeHotelFile(file){
    try {
        await writeFile('saida.txt', file)
    } catch (error) {
        
    }
}