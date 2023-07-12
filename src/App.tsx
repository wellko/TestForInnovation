import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ru';

dayjs.extend(localizedFormat);
dayjs.locale('ru');

interface Contributions {
    [key: string]: string
}

interface Day {
    id: string,
    contributions: number,
}

const axiosApi = axios.create({
    baseURL: ' https://dpg.gg/test/'
});

function App() {
    const [contributions, setContributions] = useState<Contributions>({})
    const getContributions = useCallback(async () => {
        try {
            const result = await axiosApi.get<Contributions>('calendar.json');
            if (result.data !== null) {
                setContributions(result.data);
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        getContributions().catch(console.error)
    }, [getContributions])

    const startDate = dayjs(Date.now()).day();

    const days: Day[] = [];

    const emptyCells: number[] = [];

    const months: string[] = [];

    const weekdays = ['Пн', ' ', ' Ср', ' ', 'Пт', ' ', ' '];

    for (let i = 0; i<13; i++){
        const month = dayjs(Date.now()).add(+i, 'month').format('MMM');
        months.push(month);
    }

    for (let i = 1; i <= startDate; i++) {
        if (i <= startDate) {
            emptyCells.push(i);
        }
    }

    for (let i = 0; i < 357; i++) {
        const date = dayjs(Date.now()).add(-i, 'day').format('YYYY-MM-DD');
        days.unshift({
            id: date,
            contributions: 0
        })
    }

    if (contributions && days.length > 0) {
        Object.keys(contributions).forEach(key => {
            const index = days.findIndex(el => el.id === key);
            days[index] = {
                id: key,
                contributions: parseInt(contributions[key])
            }
        })
    }

    const [popup, setPopup] = useState<null | string>(null);

    const onClick = (id: string) => {
        setPopup(id);
    }

    return (
        <div className="container">
                <div className='grid-block'>
                    <div className='months'>
                        {months.map(el => <div className='monthDescription' key={Math.random()}>{el}</div>)}
                    </div>
                    {weekdays.map(el => <div key={Math.random()} className='inactive-cell'> {el} </div>)}
                    {emptyCells.map(() => <div key={Math.random()} className='inactive-cell'/>)}
                    {days.map((el) => {
                        let color = '';
                        if (el.contributions >= 30) {
                            color = '#254E77';
                        } else if (el.contributions >= 20) {
                            color = '#527BA0';
                        } else if (el.contributions >= 10) {
                            color = '#7FA8C9';
                        } else if (el.contributions > 0) {
                            color = '#ACD5F2'
                        }
                        return <div
                            onClick={() => onClick(el.id)}
                            className='active-cell'
                            style={{background: color}}
                            key={el.id}>
                            <div className={popup === el.id ? 'popup opened' : 'popup closed'}>
                                <p>{el.contributions} - contributions</p>
                                <p>{dayjs(el.id).format('ll')}</p>
                            </div>
                        </div>
                    })}
                </div>
                <div>
                    <span className='colorGrey'>Меньше</span>
                    <div onClick={() => onClick('0')} className='active-cell displayInline'>
                        <div className={popup === '0' ? 'popup popupOptions opened' : 'popup closed'}>
                            <span>0 contributions</span>
                        </div>
                    </div>
                    <div onClick={() => onClick('1')} className='active-cell displayInline'
                         style={{background: '#ACD5F2'}}>
                        <div className={popup === '1' ? 'popup popupOptions opened' : 'popup closed'}>
                            <span>1+ contributions</span>
                        </div>
                    </div>
                    <div onClick={() => onClick('2')} className='active-cell displayInline'
                         style={{background: '#7FA8C9'}}>
                        <div className={popup === '2' ? 'popup popupOptions opened' : 'popup closed'}>
                            <span>10+ contributions</span>
                        </div>
                    </div>
                    <div onClick={() => onClick('3')} className='active-cell displayInline'
                         style={{background: '#527BA0'}}>
                        <div className={popup === '3' ? 'popup popupOptions opened' : 'popup closed'}>
                            <span>20+ contributions</span>
                        </div>
                    </div>
                    <div onClick={() => onClick('4')} className='active-cell displayInline'
                         style={{background: '#254E77'}}>
                        <div className={popup === '4' ? 'popup popupOptions opened' : 'popup closed'}>
                            <span>30+ contributions</span>
                        </div>
                    </div>
                    <span className='colorGrey'>Больше</span>
                </div>
        </div>
    );
}

export default App;
