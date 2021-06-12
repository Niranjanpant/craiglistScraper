const request = require("request-promise")
const cheerio = require("cheerio")
const ObjectsToCsv = require("objects-to-csv")

const url = "https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof";

// const scrapeSample = {
//     title:"Software Business Analyst",
//     description:"test about job",
//     datePosted:new Date("2021-6-4"),
//     link:"https://sfbay.craigslist.org/pen/sof/d/mountain-view-software-business-analyst/7331945789.html",
    
// }
const scrapeResults =[]

async function scrapeHeader() {
try{
    const html = await request.get(url)
    const $ = await cheerio.load(html)

    $(".result-info").each((index,element)=>{
        const titleResult= $(element).children(".result-heading");
        const title = titleResult.text();
        const url = titleResult.children(".result-title").attr("href")
        const datePosted = $(element).children(".result-date").attr("datetime");
        
        const scrapeResult  = {title,url,datePosted}
    
        scrapeResults.push(scrapeResult)
        
    });
return scrapeResults;      
}
catch(e){
    console.log(e)
}}

async function scrapeDescription(jobHeaders){
return await Promise.all(jobHeaders.map(async (job) => {
    try{
        const htmlResult = await request.get(job.url)
        const $ = await cheerio.load(htmlResult);
    
         $(".print-qrcode-container").remove()
        
         job.description = $("#postingbody").text()
    return job;
    }catch(e){
console.log(e)
    }

}))  


}

async function createCsvFile(data){

    let csv = new ObjectsToCsv(data);
 
    // Save to file:
    await csv.toDisk('./test.csv');
   

}

async function scrapeData() {

const jobHeaders = await scrapeHeader();

const jobDescription = await scrapeDescription(jobHeaders)

await createCsvFile(jobDescription)

}

scrapeData()