import { getStockHistory } from '@renderer/store/chartData';
import { months } from '@shared/constants';
import { CandlestickData, ColorType, createChart, Time } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react'
import LoadingSpinner from './LoadingSpinner';

export type HistoryData = { // loading charts
  data: CandlestickData<Time>[],
  updating: boolean
}


const StockChart = ({symbol, divRef, className='', height, period}) => {
  const [history, setHistory] = useState<HistoryData>({
    data: [],
    updating: true
  })

  const chartRef= useRef<HTMLDivElement>(null)
  const {data, updating} = history
  useEffect(() => {
    setHistory({
      ...history,
      updating: true
    })
  }, [period, symbol])

  useEffect(() => {
    //if (!updating) {return}
    //load data
    getStockHistory(symbol, period)
      .then((fetchedHistory) => {
        setHistory({
          data: fetchedHistory,
          updating: false
        }); // Update state with fetched history
      })
      .catch((error) => {
        console.error('Error fetching history:', error);
      });

  }, [updating])

  //creating the chart
  useEffect(() => {
    if (!chartRef.current || data.length==0) return;

    const chart = createChart(chartRef.current, {
      
      width: divRef.current.clientWidth-1,
      height: height,
      //height: 400,
      layout: {
        background: {type: ColorType.Solid, color: 'white'},
        textColor: '#000000',
        attributionLogo: false,
      },
      grid: {
        vertLines: {
          color: '#ffffff',
        },
        horzLines: {
          color: '#f0f3fa',
        },
      },
      leftPriceScale: {
        borderColor: '#e0e0e0',
      },
      timeScale: {
        borderColor: '#e0e0e0',
      },
      
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });

    candleSeries.setData(data)
    chart.timeScale().fitContent();

    chart.applyOptions({
      localization: {
        timeFormatter: (utcTimestamp) => {
          const date = new Date(utcTimestamp * 1000); // Convert to milliseconds

          // Array of month abbreviations
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
          // Extract date components
          const day = String(date.getDate()).padStart(2, '0');
          const month = months[date.getMonth()];
          const year = date.getFullYear();
        
          // Format hours and minutes
          let hours = date.getHours();
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          
          // Convert 24-hour format to 12-hour format
          hours = hours % 12;
          hours = hours ? hours : 12; // If hours is 0, set it to 12
        
          // Combine everything into the desired format
          const formattedDate = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
        
          return formattedDate;
        },
      },
    });

    const handleResize = () => {
      if (!divRef.current) return;
      chart.timeScale().fitContent();
      chart.applyOptions({ width: divRef.current.clientWidth-1 });
    };


    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };

  }, [history]);

  return <>
    <div className={className} ref={chartRef} key={period}/>
    {updating ? <LoadingSpinner/> : ''}
  </>
}

export default StockChart