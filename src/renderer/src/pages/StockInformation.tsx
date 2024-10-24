import BuySellButton from "@renderer/components/BuySellButton";
import Earnings from "@renderer/components/Earnings";
import LoadingDots from "@renderer/components/LoadingDots";
import StockChart from "@renderer/components/StockChart";
import { accountDataAtom, activeStocksAtom } from "@renderer/store";
import { intervals } from "@shared/constants";
import { FetchedNewsData } from "@shared/context";
import {calculateTodaysPositionEarning, formatNumber, getCurrentStockPrice, getPositionHistory, positionExists } from "@renderer/store/utils";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";


const StockInfoPage = () => {
  const { symbol } = useParams(); // Get the stock symbol from the URL params
  const [exists, setExists] = useState(-1)
  const [news, setNews] = useState<FetchedNewsData[]>([]); // Store fetched news here
  const [currPeriod, setPeriod] = useState<String>("1y")
  const data = useAtomValue(accountDataAtom)
  const chartDivRef = useRef(null)

  const [stockMetaData, setStockData] = useState<Object>({})
  useEffect(() => {
    if (!symbol) {return}
    positionExists(symbol).then((fetched)=>{
      if (!fetched) {setExists(1); return} else {setExists(0)}
      //load data
      getPositionHistory(symbol, "1d")
      .then((fetchedHistory) => {
        setStockData(fetchedHistory.metaData); // Update state with fetched history
      })
      .catch((error) => {
        console.error('Error fetching history:', error);
      });
    window.context.fetchNews(symbol)
      .then((fetchedNews) => {
        setNews(fetchedNews)
      }).catch((error) => {
        console.error('Error fetching news:', error);
      });
    }) 
  }, [symbol])
  const activeStocks = useAtomValue(activeStocksAtom)
  let symbolName = "";
  if (activeStocks) {
      for (const stock of activeStocks) {
        if (stock.symbol==symbol) {symbolName=stock.name; break;}
      }
  }
  if (exists == 1) return (
    <div className="page-size flex flex-center">
      <Link to="/home" className='page-heading hover:text-zinc-400 transition-all'>
        Could not find {symbol}
      </Link>
    </div>
  )
  return (
    <div className="page-size flex flex-col">
      {/* title and overview */}
      <div className="flex flex-col w-full">
        <h1 className='page-heading mb-1 text-5xl font-semibold'>{symbol}</h1>
        <p className="mx-6 -my-0.5 text-xl font-light">{symbolName}</p>
        {exists==0 ?
          <BuySellButton className="mx-5" symbol={symbol}/>
          : ''
        }
      </div>  
      {/* info and stuff */}
      <div className="border-t-2 m-1 w-[100%-16px] flex">
        <div className='flex-1 flex flex-col m-2'> 
          <div className='flex-1 border border-gray-300 rounded-md p-3'>
            <p className='text-xl font-semibold'>Chart - {symbol}</p>
            {/* graph */}
            <div className='h-[500px] w-full' ref={chartDivRef}>
              {exists==0 ?
                <StockChart className="absolute" symbol={symbol} period={currPeriod} height={500} divRef={chartDivRef}/>
                : ''
              }
            </div>
            <div className="mt-1 flex flex-nowrap pb-0.5 w-full justify-center space-x-1">
              {Object.keys(intervals).map((period, i) => {
                return <button 
                key={i} 
                className={`${currPeriod == period ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md p-1 mr-0.5 hover:bg-blue-600`}
                onClick={() => setPeriod(period)}
                >
                  {period.toUpperCase()}
                </button>
              })}
            </div>
          </div>
        </div>

        <div className='flex-[.75] flex flex-col m-2 flex space-y-2'>

          <div className='flex-1 border border-gray-300 rounded-md p-3'>
            <p className='text-2xl font-semibold'>Overview</p>
            {Object.keys(stockMetaData).length !== 0 ? 
            <div className="w-full p-2 flex justify-center items-center">
              <div className='flex items-start flex-col  w-full'>
                <div className='flex justify-between pb-1.5 border-b w-full'>
                  <p className='text-base'>Current Value:</p>
                  <div className='text-base'>{formatNumber(getCurrentStockPrice(null, stockMetaData))}</div>
                </div>
                <div className='flex justify-between border-b pb-1.5 w-full'>
                  <p className='text-base'>Todays Earnings:</p>
                  <Earnings className='text-base' earnings={calculateTodaysPositionEarning(null, stockMetaData)}/>
                </div>
                <div className='flex justify-between border-b pb-1.5 w-full'>
                  <p className='text-base'>Today's High:</p>
                  <div className='text-base text-green-600'>{formatNumber(stockMetaData["regularMarketDayHigh"])}</div>
                </div>
                <div className='flex justify-between border-b pb-1.5 w-full'>
                  <p className='text-base'>Today's low:</p>
                  <div className='text-base text-red-600'>{formatNumber(stockMetaData["regularMarketDayLow"])}</div>
                </div>
                <div className='flex justify-between border-b pb-1.5 w-full'>
                  <p className='text-base'>Previous Close:</p>
                  <div className='text-base'>{formatNumber(stockMetaData["previousClose"])}</div>
                </div>
                <div className='flex justify-between pb-1.5 border-b w-full'>
                  <p className='text-base'>Short Name:</p>
                  <p className='text-base'>{stockMetaData["shortName"]}</p>
                </div>
              </div>
            </div>
            : <LoadingDots/>
            }
          </div>

          <div className='flex flex-col flex-1 border border-gray-300 rounded-md p-3 overflow-hidden'>
            <p className='text-2xl font-semibold'>Recent News</p>
            {news.length > 0 ? 
            news.map((n, i) => {
              return <div className="w-full border-b p-0.5 flex justify-between" key={i}>
                <a 
                href={n.link} 
                target="_blank" // Open link in a new tab
                rel="noopener noreferrer" // Security best practice
                className="max-w-[450px] max-md:max-w-[150px] max-lg:max-w-[250px] link w-full text-sm text-nowrap whitespace-nowrap overflow-hidden text-ellipsis">
                  {n.headline}
                </a>
                <p className="text-xs text-gray-500">{n.source}</p>
              </div>
            })
            : <LoadingDots/>
            }
          </div>

        </div>
      </div> 
      
    </div>
  );
};

export default StockInfoPage