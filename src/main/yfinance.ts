import axios from "axios";
import {CandleData, Stock } from "@shared/models";
import Client from 'ftp';
import { FetchedNewsData } from "@shared/context";
import * as cheerio from 'cheerio';
import { newsFetchCount } from "@shared/constants";

const history_url = "https://query2.finance.yahoo.com/v8/finance/chart/";
const user_agent_headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
};

export const getHistory = (request) => {

    let symbol = request.symbol;
    const request_url = history_url + symbol;
    // console.log(request);
    return axios(request_url,{
        params : {
            interval : request.interval,
            events : "div,splits",
            range : request.period,
        },
        headers : user_agent_headers
    }).then((data) => {
        // console.log(data);
        const result = extractChartData(data.data);
        return result
    }).catch((error) => {
        console.warn(error)
        if (error.status) {
          return error.status
        } else {
          return 0
        }
    });
}

const extractChartData = (data) => {

  const indicators = data.chart.result[0].indicators.quote[0];
  const timeStamp = data.chart.result[0].timestamp;
  const metaData = data.chart.result[0].meta;
  ///console.log(data.chart.result)
  const length  = timeStamp.length;
  let candleData:CandleData = {}
  for(let i =0 ; i < length; i++) {
      if(indicators.open[i] !== null) {
         //const currDate = new Date(timeStamp[i] *1000)
          candleData[timeStamp[i] *1000] = {
            open : indicators.open[i],
            high : indicators.high[i],
            low : indicators.low[i],
            close : indicators.close[i],
            volume : indicators.volume[i],
          };
      }
  }

  // console.log()
  return {
      chartData : candleData,
      metaData : metaData
  }
}

// info: https://www.nasdaqtrader.com/trader.aspx?id=symboldirdefs
// data: ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqtraded.txt

export function getActiveSymbols(): Promise<Stock[]> {
  return new Promise((resolve, reject) => {
      const ftpClient = new Client();

      ftpClient.on('ready', () => {
          ftpClient.cwd("SymbolDirectory", (err) => {
              if (err) {
                  ftpClient.end();
                  reject(err);
                  return;
              }

              ftpClient.get('nasdaqtraded.txt', (err, stream) => {
                  if (err) {
                      ftpClient.end();
                      reject(err);
                      return;
                  }

                  let data = '';
                  stream.on('data', (chunk) => {
                      data += chunk.toString(); // Accumulate data in memory
                  });

                  stream.on('end', () => {
                      ftpClient.end();
                      const symbols = parseNasdaqSymbols(data);
                      resolve(symbols);
                  });
              });
          });
      });

      ftpClient.connect({
          host: 'ftp.nasdaqtrader.com'
      });
  });
}
const parseNasdaqSymbols = async(data: string): Promise<Stock[]> => {
  const lines = data.split('\n');
  const stocks: Stock[] = [];

  for (const line of lines.slice(1)) {
    const lineComponents = line.split('|');
    // Check for valid lines with ticker and skip file creation time
    if (lineComponents[0].length !== 1) {
        continue;
    }

    const ticker = lineComponents[1];
    const name = lineComponents[2]; 
    stocks.push({ symbol: ticker, name });
}

  return stocks;
}



export const getNews=async(stock: string): Promise<FetchedNewsData[]>=> {
  const url = `https://finviz.com/quote.ashx?t=${stock}&p=d`;
  const headers = { 'User-Agent': 'news_scraper' };
  
  try {
    // Fetch the HTML from the Finviz URL
    const { data } = await axios.get(url, { headers });
    
    // Load the HTML into Cheerio for parsing
    const $ = cheerio.load(data);
    
    // Find the news table on the page
    const newsTable = $('#news-table');
    
    const newsParsed: FetchedNewsData[] = [];
    
    // Loop through each news row and extract the headline, source, and link
    newsTable.find('tr').each((index, element) => {
      if (index >= newsFetchCount) {return false}
      const headlineElement = $(element).find('a');
      const headline = headlineElement.text(); // Extract headline text
      const link = headlineElement.attr('href'); // Extract the URL from the 'href' attribute
      const source = $(element).find('span').text(); // Extract source text
      if (headline && source && link) {
        newsParsed.push({
          headline,
          source,
          link, // Include the link in the output
        });
      }
    });
    
    return newsParsed;
  } catch (error) {
    console.error(`Error fetching news for ${stock}:`, error);
    return [];
  }
}
