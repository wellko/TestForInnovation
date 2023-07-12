import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import axios from "axios";

interface Contributions {
    [key: string]: string
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
    return (
        <div className="App">
            <button onClick={() => console.log(contributions)}/>
        </div>
    );
}

export default App;
