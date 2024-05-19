import { useState, useEffect } from 'react'
import './App.css'
import LineChart from './components/LineChart';
import { Table } from "antd";
import Papa from 'papaparse';
import { DownOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Space } from 'antd';
function App() {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState({}); // Store detailed job titles and counts for each year
  useEffect(() => {
    // Function to fetch and parse CSV file
    const fetchData = async () => {
      try {
        const response = await fetch('/salaries.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csvData = decoder.decode(result.value);
        const results = Papa.parse(csvData, { header: true });
        processCSV(results.data); // Process CSV data
      } catch (error) {
        console.error('Error fetching and parsing CSV data:', error);
      }
    };

    fetchData();
  }, []);

  const processCSV = (data) => {
    const stats = {};
    const details = {};

    data.forEach((row) => {
      const year = row.work_year;
      const jobTitle = row.job_title;
      const salaryUSD = parseFloat(row.salary_in_usd);

      // Skip rows with missing or invalid data
      if (!year || isNaN(salaryUSD) || !jobTitle) {
        return;
      }

      // Aggregate main stats
      if (!stats[year]) {
        stats[year] = { jobs: 0, totalSalary: 0 };
      }
      stats[year].jobs += 1;
      stats[year].totalSalary += salaryUSD;

      // Aggregate detailed stats
      if (!details[year]) {
        details[year] = {};
      }
      if (!details[year][jobTitle]) {
        details[year][jobTitle] = 0;
      }
      details[year][jobTitle] += 1;
    });

    // Convert main stats to array
    const processedData = Object.keys(stats).map((year, index) => ({
      key: index,
      year,
      jobs: stats[year].jobs,
      avgSalary: (stats[year].totalSalary / stats[year].jobs).toFixed(2),
    }));

    setData(processedData);
    setDetails(details);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const expandedRowRender = (record) => {
    const year = record.year;
    const detailData = details[year]
      ? Object.keys(details[year]).map((title, index) => ({
        key: index,
        jobTitle: title,
        jobCount: details[year][title],
      }))
      : [];

    const columns = [
      {
        title: 'Job Title',
        dataIndex: 'jobTitle',
      },
      {
        title: 'Number of Jobs',
        dataIndex: 'jobCount',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.jobCount - b.jobCount,
      },
    ];

    return <Table columns={columns} dataSource={detailData} pagination={true} />;
  };
  const columns = [
    {
      title: 'Year',
      dataIndex: 'year',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'jobs',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.jobs - b.jobs,
    },
    {
      title: 'Avg Salary (USD)',
      dataIndex: 'avgSalary',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.avgSalary - b.avgSalary,
    },
  ];
  const data2 = [];
  for (let i = 0; i < 3; ++i) {
    data2.push({
      key: i.toString(),
      name: 'Screen',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    });
  }
  return (
    <>
      <div className="text-center m-4">
        <h1 className="font-bold text-xl">Main Table</h1>
      </div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['0'],
        }}
        dataSource={data}
        onChange={onChange}
      />
      <div>
        <div className="text-center mb-2">
          <h1>Line Graphs for Analysis</h1>
        </div>
        <div className="flex flex-col items-center lg:flex-row justify-center">
          <LineChart label="Number of Jobs" yaxis="jobs" data={data} xaxis="year" color="#f77f00" />
          <LineChart label="Average Salary" yaxis="avgSalary" data={data} xaxis="year" color="#264653" />
        </div>
      </div>


    </>
  )
}

export default App
