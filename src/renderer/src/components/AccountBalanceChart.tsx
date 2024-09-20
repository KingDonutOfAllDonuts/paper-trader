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
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false
      },
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
        timeFormatter: (businessDay) => {
          

          const { year, month, day } = businessDay;
          return `${months[month - 1]} ${day}, ${year}`
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