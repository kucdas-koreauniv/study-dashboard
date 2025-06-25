// src/App.jsx
import AttendanceGrid from "./components/AttendanceGrid.tsx";
import './App.css';

function App() {
    return (
        <div className="app">
            <h1 className="title">KUCDAS Study Board </h1>
            <AttendanceGrid />
        </div>
    );
}

export default App;