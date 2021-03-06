import {promises as fs} from 'fs';
const { readFile, writeFile } = fs;


const entradaPath = "./files/Entrada.txt"
const hotelsPath = './hotels.json'
const saidaPath = './files/saida.txt'

init()



async function init(){
    try {
        const file  = await readDateFile(entradaPath)
        const hotels = await readHotelsFile(hotelsPath)
        var dates
        var type
        if(file instanceof String){
            dates = file.split(/[\s,:]+/)
            type = dates[0]
            dates.splice(0, 1)
            const hotel = findHotel(type, dates, hotels);
            await writeHotelFile(hotel, saidaPath)
        }else{
            console.log("Falha ao ler o arquivo")
        }


    } catch (error) {
        console.log(error)
    }

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
                console.log('Plano inv??lido');
    }

    const sortedPrices = prices.sort((a,b)=>{
        return a.cost - b.cost; 
    });

    const hotel = sortedPrices[0]
    return hotel.name
}

async function readDateFile(path){
    try {
        const data = await readFile(path, "utf-8");
        return data
    } catch (error) {
        return error
    }
}
async function readHotelsFile(path){
    try {
        const data = JSON.parse(await readFile(path));
        return data
    } catch (error) {
        return error
    }
}

async function writeHotelFile(file, path){
    try {
        await writeFile(path, file)
    } catch (error) {
        
    }
}