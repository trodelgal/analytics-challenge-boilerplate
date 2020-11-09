import {useState, useEffect} from 'react'
import axios from "axios";
import { eventName, browser, sorting, Event } from "../../models/event";

export default function useFilterData(sorting:sorting, type:eventName, browser:browser, search:string, offset:number) {
    const [loading,setLoading] = useState<boolean>(true)
    const [error,setError] = useState<boolean>(true)
    const [data,setData] = useState<Event[]>()
    const [hasMore,setHasMore] = useState<boolean>(false)

    useEffect(() => {
        setData(undefined)
    },[sorting, type, browser, search, offset])


    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel:any;
        axios(
          {
            method: 'GET',
            url:`http://localhost:3001/events/all-filtered?sorting=${sorting}&type=${type}&browser=${browser}&search=${search}&offset=${offset}`,
            cancelToken: new axios.CancelToken(c => cancel = c)
          }).then((res) =>{
            setData((prevData)=>{
                if(prevData){
                    return [...prevData, res.data.events];
                }else{
                    return res.data.events;
                }
            })
            setHasMore(res.data.more)
            setLoading(false);
          })
          .catch(error=>{
            if(axios.isCancel(error)) return
            setError(true);
          })
          return () => cancel()
      }, [sorting, type, browser, search, offset]);

    return {loading, error, data, hasMore}
}
