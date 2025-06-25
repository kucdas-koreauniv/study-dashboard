// src/components/AttendanceGrid.jsx
import {useState, useEffect} from "react";
import type { AttendanceDataMap } from "../types/AttendanceType.ts";
import { getCurrentPRData } from "../api/getData.ts";
import './AttendanceGrid.css';


function AttendanceGrid() {
    const [data, setData] = useState<AttendanceDataMap>({});

    useEffect(() => {
        async function fetchData() {
            const attendanceData = await getCurrentPRData();
            setData(attendanceData);
        }
        fetchData();
    },[]);

    return (
        <div className="grid-container">
            <table>
                <thead>
                <tr>
                    <th>이름</th>
                    {Array.from({ length: 15 }, (_, i) => <th key={i}>W{i + 1}</th>)}
                </tr>
                </thead>
                <tbody>
                {Object.entries(data).map(([name, weeks]) => (
                    <tr key={name}>
                        <td className="name-cell">{name}</td>
                        {weeks.map((week, idx) => (
                            <td key={idx}>
                                <div className={`square ${week ? 'attended' : 'missed'}`}></div>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AttendanceGrid;
