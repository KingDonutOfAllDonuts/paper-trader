import { getAccountBalanceHistory } from "@shared/chartData";
import { ColorType, createChart, LineData, Time } from "lightweight-charts";
import React, {useEffect, useRef, useState} from "react";
import LoadingSpinner from "./LoadingSpinner";
import { months } from "@shared/constants";


export type HistoryData = { // loading charts
  data: LineData<Time>[],
  updating: boolean
}

//<null | LineData<Time>[]>
const AccountBalanceChart = ({divRef, className='', acc, stockData }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<HistoryData>({
    data: [],
    updating: true
  })

  const {data, updating} = history

  useEffect(() => {
    if (!updating) {return}
    //load data
    getAccountBalanceHistory(acc, stockData)
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
    if (!chartContainerRef.current || data.length==0) return;

    const chart = createChart(chartContainerRef.current, {
      
      width: divRef.current.clientWidth,
      height: 300,
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
        timeVisible: true,
      },
      
    }); 
    const lineSeries = chart.addLineSeries({
      color: '#2196f3',
      lineWidth: 2,
    });

    lineSeries.setData(data)
    chart.timeScale().fitContent();

    chart.applyOptions({
      localization: {
        timeFormatter: (utcTimestamp) => {
          const date = new Date(utcTimestamp * 1000); // Convert to milliseconds

          // Array of month abbreviations
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
          // Extract date components
          const day = String(date.getUTCDate()).padStart(2, '0');
          const month = months[date.getUTCMonth()];
          const year = date.getUTCFullYear();
        
          // Format hours and minutes
          let hours = date.getUTCHours();
          const minutes = String(date.getUTCMinutes()).padStart(2, '0');
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
    <div className={className} ref={chartContainerRef} />
    {updating ? <LoadingSpinner/> : ''}
  </>
};

export default AccountBalanceChart;