import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale, // x axis 
    LinearScale, // y axis
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';

export default function LineChart({ label, yaxis, data, xaxis, color }) {
    ChartJS.register(
        LineElement,
        CategoryScale, // x axis 
        LinearScale, // y axis
        PointElement,
        Tooltip,
        Legend
    )
    return (
        <>
            <div className="w-10/12 md:w-6/12">
                <Line
                    data={{
                        labels: data.map((row) => row[xaxis]),
                        datasets: [
                            {
                                label: label,
                                data: data.map((row) => row[yaxis]),
                                fill: false,
                                borderColor: color,
                                tension: 0.1
                            }
                        ]
                    }}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }}
                />
            </div>
        </>
    )
}