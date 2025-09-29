import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SubjectProgressBarChart = ({ data }) => {
  // Define some colors for the bars
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical" // Makes the bars horizontal
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <YAxis dataKey="subject" type="category" width={80} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="Progress" barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubjectProgressBarChart;