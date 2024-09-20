import axios from "axios";
import { Candle, CandleData } from "@shared/models";

const base_url = "https://query2.finance.yahoo.com";
const user_agent_headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

export const getHistory = (request) => {

    let symbol = request.symbol;
    const request_url = base_url + "/v8/finance/chart/" + symbol;
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
        console.log(error)
        return null;
        
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