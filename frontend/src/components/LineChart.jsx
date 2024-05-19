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
            <div className="w-300 h-300 lg:w-[400px] lg:h-[400px] xl:w-[600px] xl:h-[500px]">
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